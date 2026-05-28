using System.Diagnostics;
using System.Text.Json;
using Altec.Api.Record.NiceLabel;
using ClosedXML.Excel;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;

namespace Altec.Api.Services.Automation;

public class AutomationService : IAutomationService
{
    private readonly IConfiguration _config;
    private readonly HttpClient _httpClient;

    public AutomationService(IConfiguration config, HttpClient httpClient)
    {
        _config = config;
        _httpClient = httpClient;
    }
    
    public async Task PrintSerialNumbers(IFormFile excelFile, string printerType, string? printerName)
    {
        var excelData = ReadExcelData(excelFile, printerType);
        var requestData = BuildSerialNumbersContent(excelData, printerName);
        var request = new HttpRequestMessage(HttpMethod.Post, "/api/nicelabel/printLabelVariables")
        {
            Content = requestData
        };

        var response = await _httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();
    }
    
    private List<SerialNumberData> ReadExcelData(IFormFile excelFile, string printerType)
    {
        var stream = excelFile.OpenReadStream();
        var workbook = new XLWorkbook(stream);
        var sheet1 = workbook.Worksheets.Worksheet("blad1");
        var serialNumbersList = new List<SerialNumberData>();

        foreach (var row in sheet1.Rows().Skip(1))
        {
            var sn = row.Cell(1).Value.ToString() ?? "";
            var mac = row.Cell(2).Value.ToString() ?? "";
            serialNumbersList.Add(new SerialNumberData(sn, mac, printerType));
        }
        
        return serialNumbersList.OrderBy(serialData => int.Parse(new string(serialData.SerialNumber.Where(char.IsDigit).ToArray()))).ToList();
    }
    
    private MultipartFormDataContent BuildSerialNumbersContent(List<SerialNumberData> serialNumbersList, string? printerName)
    {
        var requestData = new MultipartFormDataContent();
        var fileStream = File.OpenRead(_config["LabelPaths:SerialNewPrintersLabel"]);
        
        var allVariables = serialNumbersList.Select(s => new Dictionary<string, string> {
            ["sn"] = s.SerialNumber,
            ["mac"] = s.MacAddress,
            ["type"] = s.Type
        }).ToList();
        
        var json = JsonSerializer.Serialize(allVariables);
        requestData.Add(new StringContent(json), "variables");
        
        StreamContent labelStream = new StreamContent(fileStream);
        requestData.Add(labelStream, "label");
            
        if (printerName != null)
            requestData.Add(new StringContent(printerName), "printerName");
        
        return requestData;
    }

    public async Task<List<string>> PreviewSerialNumbers(IFormFile excelFile, string printerType)
    {
        const int labelsPerPage = 10;
        var excelData = ReadExcelData(excelFile, printerType).Take(labelsPerPage).ToList();
        var requestData = BuildSerialNumbersContent(excelData, null);
        
        var request = new HttpRequestMessage(HttpMethod.Post, "/api/nicelabel/labelPreviewBatch")
        {
            Content = requestData
        };

        var response = await _httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();
        
        var result = await response.Content.ReadFromJsonAsync<List<byte[]>>();

        if (result == null) throw new InvalidOperationException("Failed to deserialize label preview response");

        var labelPreviews = ComposeLabelsIntoPages(result, labelsPerPage);

        return labelPreviews;
    }

    private List<string> ComposeLabelsIntoPages(List<byte[]> labelImages, int labelsPerPage)
    {
        var pages = labelImages.Chunk(labelsPerPage);
        List<string> result = new List<string>();

        foreach (var pageChunk in pages)
        {   
            using var ms = new MemoryStream();  
            using var firstLabel = Image.Load(pageChunk[0]);
            int labelWidth = firstLabel.Width;
            int labelHeight = firstLabel.Height;

            using var page = new Image<Rgba32>(labelWidth, labelHeight * labelsPerPage);

            for (int i = 0; i < pageChunk.Length; i++)
            {
                using var labelImage = Image.Load(pageChunk[i]);
                int yPosition = i * labelHeight;
                page.Mutate(ctx => ctx.DrawImage(labelImage, new Point(0, yPosition), 1f));
            }       
            page.SaveAsPng(ms);    
            result.Add(Convert.ToBase64String(ms.ToArray()));           
        }
        return result;
    }

    public async Task PrintSdCardLabel(string orderNumber, string version, int amount)
    {
        throw new NotImplementedException();
    }
}
