using System.Reflection.Emit;
using System.Text.Json;
using Altec.Api.Record.NiceLabel;
using DocumentFormat.OpenXml.Drawing.Charts;
using DocumentFormat.OpenXml.Math;
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
    
    public async Task PrintSerialNumbers(IFormFile csvFile, string printerType, string? printerName)
    {
        var excelData = ReadCsvData(csvFile, printerType);
        var requestData = BuildSerialNumbersContent(excelData, printerName);
        var request = new HttpRequestMessage(HttpMethod.Post, "/api/nicelabel/printVariableLabel")
        {
            Content = requestData
        };

        var response = await _httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();
    }
    
    private List<SerialNumberData> ReadCsvData(IFormFile csvFile, string printerType)
    {
        using var reader = new StreamReader(csvFile.OpenReadStream());
        var serialNumbersList = new List<SerialNumberData>();
        string? line;
        bool isFirstLine = true;
        var lineNumber = 0;

        while ((line = reader.ReadLine()) != null)
        {
            lineNumber++;
            if (isFirstLine) { isFirstLine = false; continue; }
            var parts = line.Split(";");
            if (parts.Length < 2) throw new ArgumentException($"Unable to parse: line:{lineNumber}");
            
            serialNumbersList.Add(new SerialNumberData(parts[0].Trim(), parts[1].Trim(), printerType));
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

    public async Task<List<string>> PreviewSerialNumbers(IFormFile csvFile, string printerType)
    {
        const int labelsPerPage = 10;
        var excelData = ReadCsvData(csvFile, printerType).Take(labelsPerPage).ToList();
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
        var requestData = new MultipartFormDataContent();
        var fileStream = File.OpenRead(_config["LabelPaths:SdCard"]);
        var variables = new Dictionary<string, string>
        {
          ["Order nummer"] = orderNumber,
          ["Versie"] = version,
        };

        var data = Enumerable.Repeat(variables, amount).ToList();

        var json = JsonSerializer.Serialize(data);
        requestData.Add(new StringContent(json), "variables");
                
        StreamContent labelStream = new StreamContent(fileStream);
        requestData.Add(labelStream, "label");
            
        var request = new HttpRequestMessage(HttpMethod.Post, "/api/nicelabel/printVariableLabel")
        {
            Content = requestData
        };

        var response = await _httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();
    }

    public async Task<string> SdCardLabelPreview(string orderNumber, string version)
    {
        var requestData = new MultipartFormDataContent();
        var fileStream = File.OpenRead(_config["LabelPaths:SdCard"]);
        var variables = new Dictionary<string, string>
        {
          ["Order nummer"] = orderNumber,
          ["Versie"] = version,
        };

        var data = new List<Dictionary<string,string>> { variables };

        var json = JsonSerializer.Serialize(data);
        requestData.Add(new StringContent(json), "variables");
        
        StreamContent labelStream = new StreamContent(fileStream);
        requestData.Add(labelStream, "label");
            
        var request = new HttpRequestMessage(HttpMethod.Post, "/api/nicelabel/labelPreviewBatch")
        {
            Content = requestData
        };

        var response = await _httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadFromJsonAsync<List<byte[]>>();

        if (result == null) throw new InvalidOperationException("Failed to deserialize label preview response");

        return Convert.ToBase64String(result[0]);
    }

    public async Task PrintTestRoomLabel(string sensorType, int speed, int density, bool cutter, bool userLabel, string printer)
    {
        var (totalLabels, labelVariables, printSettings) = BuildTestRoomData(speed, density, cutter, userLabel, printer);

        for (int i = 0; i < totalLabels; i++)
        {
            var labelNumber = i + 1;
            var sensorLabel = AssignLabelSensor(sensorType, labelNumber);
            using var requestData = BuildPrintTestRoomRequestData(sensorLabel, labelNumber, printer, labelVariables, printSettings);

            var request = new HttpRequestMessage(HttpMethod.Post, "/api/nicelabel/printLabelWithSettings")
            {
                Content = requestData
            };

            var response = await _httpClient.SendAsync(request);
            response.EnsureSuccessStatusCode();
        }
    }

    private (int totalLabels, Dictionary<string, string> labelVariables, Dictionary<string,string> printSettings) BuildTestRoomData(int speed, int density, bool cutter, bool userLabel, string printer)
    {
        var totalLabels = userLabel ? 5 : 4;
        var printSettings = new Dictionary<string, string>
        {
            ["PrintSpeed"] = speed.ToString(),
            ["PrintDarkness"] = density.ToString(),
        };
        var labelVariables = new Dictionary<string, string>
        {
            ["cutLabel"] = cutter.ToString(),
            ["PrinterTeGebruiken"] = printer
        };

        return (totalLabels, labelVariables, printSettings);
    }

    private string AssignLabelSensor(string sensor, int labelNumber)
    {
        if (sensor == "BOTH")
        {
            if (labelNumber is 1 or 2 or 4) return "Gap";
            else return "Mark";
        }

        return sensor;
    }

    private MultipartFormDataContent BuildPrintTestRoomRequestData(string sensorLabel, int labelNumber, string printerName, Dictionary<string, string> labelVariables, Dictionary<string, string> printSettings)
    {
        var requestData = new MultipartFormDataContent();
        var fileStream = File.OpenRead(_config[$"LabelPaths:Testlabel-{sensorLabel}-{labelNumber}"]);

        StreamContent labelStream = new StreamContent(fileStream);
        requestData.Add(labelStream, "label");

        requestData.Add(new StringContent(printerName), "printerName");

        var jsonSettings = JsonSerializer.Serialize(printSettings);
        requestData.Add(new StringContent(jsonSettings), "printSettings");

        var jsonVariables = JsonSerializer.Serialize(labelVariables);
        requestData.Add(new StringContent(jsonVariables), "labelVariables");

        return requestData;
    }

    public async Task PrintQlickPrintLicensie(IFormFile dataFile)
    {
        var labelData = ReadFileData(dataFile);
        PrintQlickPrintLicensieATP(labelData);
    }

    private async void PrintQlickPrintLicensieATP(List<Dictionary<string, int>> labelData)
    {
        var requestData = BuildQlickPrintContentATP(labelData);
        var request = new HttpRequestMessage(HttpMethod.Post, "/api/nicelabel/printVariableLabel")
        {
            Content = requestData
        };

        var response = await _httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();
    }

    private MultipartFormDataContent BuildQlickPrintContentATP(List<Dictionary<string, int>> dataFile)
    {
        var requestData = new MultipartFormDataContent();
        var fileStream = File.OpenRead(_config[$"LabelPaths:QlickPrintATP"]);

        StreamContent labelStream = new StreamContent(fileStream);
        requestData.Add(labelStream, "label");
        
        var json = JsonSerializer.Serialize(dataFile);
        requestData.Add(new StringContent(json), "variables");

        return requestData;
    }

    private List<Dictionary<string, int>> ReadFileData(IFormFile dataFile)
    {
        using var reader = new StreamReader(dataFile.OpenReadStream());
        var labelData = new List<Dictionary<string, int>>();
        string? line;
        var lineNumber = 0;

        while ((line = reader.ReadLine()) != null)
        {
            lineNumber++;
            var barcode = int.Parse(line);
            if (barcode == 0) throw new ArgumentException($"Unable to parse line: {lineNumber}");
            labelData.Add(new Dictionary<string, int>{["barcode"] = barcode});
        }
        return labelData.OrderBy(barcode => barcode["barcode"]).ToList();
    }
}
