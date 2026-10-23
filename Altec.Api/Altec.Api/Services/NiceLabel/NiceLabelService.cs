using System.Text.Json;
using Altec.Api.Exceptions;
using Altec.Api.Record.NiceLabel;
using Altec.Api.Record.Printers;

namespace Altec.Api.Services.NiceLabel;

public class NicelabelService : INiceLabelService
{
    private enum LabelPart { Single, Multiple }
    private readonly HttpClient _httpClient;

    public NicelabelService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<IReadOnlyList<string>> GetVariables(IFormFile labelFile) 
    {
        var fileStream = labelFile.OpenReadStream();
        StreamContent streamContent = new StreamContent(fileStream);

        var request = new HttpRequestMessage(HttpMethod.Post, "/api/nicelabel/variables")
        {
            Content = streamContent
        };

        var response = await _httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadFromJsonAsync<List<string>>();
        return result!.AsReadOnly();
    }

    public async Task PrintLabel(IFormFile labelFile, int quantity, string? printerName)
    {
        var fileStream = labelFile.OpenReadStream();
        fileStream.Position = 0;
        StreamContent streamContent = new StreamContent(fileStream);

        var content = new MultipartFormDataContent
        {
            { streamContent, "label" },
            { new StringContent(quantity.ToString()), "quantity" }
        };

        if (printerName != null)
            content.Add(new StringContent(printerName), "printerName");

        var request = new HttpRequestMessage(HttpMethod.Post, "/api/nicelabel/printLabel")
        {
            Content = content
        };

        var response = await _httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();
    }

    public async Task<byte[]> GetLabelPreview(IFormFile labelFile, int width, int height)
    {
        var fileStream = labelFile.OpenReadStream();
        StreamContent streamContent = new StreamContent(fileStream);

        var content = new MultipartFormDataContent
        {
            { streamContent, "label" },
            { new StringContent(width.ToString()), "width" },
            { new StringContent(height.ToString()), "height" }
        };

        var request = new HttpRequestMessage(HttpMethod.Post, "/api/nicelabel/labelPreview")
        {
            Content = content
        };

        var response = await _httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadAsByteArrayAsync();
        return result;
    }

    public async Task<List<Printer>> GetPrinters()
    {
        var request = new HttpRequestMessage(HttpMethod.Get, "/api/nicelabel/printers");
        var response = await _httpClient.SendAsync(request);

        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadFromJsonAsync<List<Printer>>() 
                    ?? throw new InvalidOperationException("Failed to deserialize printers response");

        return result;
    }

    public async Task PrintVariableLabelAsync(string labelPath, List<Dictionary<string, string>> variables, int quantity = 1, string? printerName = null)
    {
        var textParts = new Dictionary<string, string>
        {
            ["variables"] = JsonSerializer.Serialize(variables),
            ["quantity"] = quantity.ToString()
        };
        if (printerName != null)
            textParts["printerName"] = printerName;

        using var response = await PostMultipartAsync(
            "/api/nicelabel/printVariableLabel", LabelPart.Single, [labelPath], textParts);
    }

    public async Task<List<byte[]>> PreviewVariableLabelsAsync(string labelPath, List<Dictionary<string, string>> variables)
    {
        var textParts = new Dictionary<string, string>
        {
            ["variables"] = JsonSerializer.Serialize(variables)
        };

        using var response = await PostMultipartAsync(
            "/api/nicelabel/labelPreviewBatch", LabelPart.Single, [labelPath], textParts);

        var result = await response.Content.ReadFromJsonAsync<List<byte[]>>();
        if (result == null)
            throw new InvalidOperationException("Failed to deserialize label preview response");

        return result;
    }

    public async Task PrintBatchAsync(IEnumerable<string> labelPaths, Dictionary<string, string> variables, Dictionary<string, string> printerSettings, string printerName)
    {
        var textParts = new Dictionary<string, string>
        {
            ["variables"] = JsonSerializer.Serialize(variables),
            ["printerSettings"] = JsonSerializer.Serialize(printerSettings),
            ["printerName"] = printerName
        };

        using var response = await PostMultipartAsync(
            "/api/nicelabel/printLabelBatch", LabelPart.Multiple, labelPaths, textParts);
    }

    public async Task PrintToPdfAsync(IEnumerable<string> labelPaths, Dictionary<string, string> variables, string outputFileName, bool appendToFile)
    {
        var textParts = new Dictionary<string, string>
        {
            ["variables"] = JsonSerializer.Serialize(variables),
            ["outputFileName"] = outputFileName,
            ["appendToFile"] = appendToFile.ToString()
        };

        using var response = await PostMultipartAsync(
            "/api/nicelabel/printToPdf", LabelPart.Multiple, labelPaths, textParts);
    }

    private async Task<HttpResponseMessage> PostMultipartAsync(string endpoint, LabelPart labelPart, IEnumerable<string> labelPaths, IReadOnlyDictionary<string, string> textParts)
    {
        var partName = labelPart == LabelPart.Single ? "label" : "labels";

        using var content = new MultipartFormDataContent();

        foreach (var path in labelPaths)
            content.Add(new StreamContent(File.OpenRead(path)), partName);

        foreach (var (name, value) in textParts)
            content.Add(new StringContent(value), name);

        var response = await _httpClient.PostAsync(endpoint, content);
        if (!response.IsSuccessStatusCode)
        {
            var body = await response.Content.ReadAsStringAsync();
            var statusCode = response.StatusCode;
            response.Dispose(); 
            throw new UpstreamServiceException(statusCode, endpoint, body);           
        }
        
        return response;
    }

    public async Task<NiceLabelLabel> GetLabelDetails(IFormFile label)
    {
        var fileStream = label.OpenReadStream();
        StreamContent streamContent = new StreamContent(fileStream);

        var request = new HttpRequestMessage(HttpMethod.Post, "/api/nicelabel/getLabelDetails")
        {
            Content = new MultipartFormDataContent
                    {
                        { streamContent, "label" },
                    }
        };

        var response = await _httpClient.SendAsync(request);

        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadFromJsonAsync<NiceLabelLabel>() 
                    ?? throw new InvalidOperationException("Unable to parse NiceLabel label");

        return result;
    }
}
