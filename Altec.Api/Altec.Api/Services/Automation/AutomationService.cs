using System.Text.Json;
using Altec.Api.Record.NiceLabel;
using ClosedXML.Excel;

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

    public async Task<byte[]> PreviewSerialNumbers(IFormFile excelFile, string printerType, int width, int height)
    {
        var excelData = ReadExcelData(excelFile, printerType);
        var requestData = BuildSerialNumbersContent(excelData, null);
        requestData.Add(new StringContent(width.ToString()), "width");
        requestData.Add(new StringContent(height.ToString()), "height");
        
        var request = new HttpRequestMessage(HttpMethod.Post, "/api/nicelabel/LabelPreviewBatch")
        {
            Content = requestData
        };

        var response = await _httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();
        
        var result = await response.Content.ReadAsByteArrayAsync();
        return result;
    }
}
