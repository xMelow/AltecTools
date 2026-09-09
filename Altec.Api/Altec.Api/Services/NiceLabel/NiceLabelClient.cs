using System.Text.Json;
using Altec.Api.Record.Printers;

namespace Altec.Api.Services.NiceLabel;

public class NiceLabelClient : INiceLabelClient
{
    private const string VariablesPart = "variables";
    private enum LabelPart { Single, Multiple }
    private readonly HttpClient _httpClient;

    public NiceLabelClient(HttpClient httpClient, IConfiguration config)
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

    public async Task<byte[]> GetLabelPreview(IFormFile labelFile, Dictionary<string, string> variables, int width, int height)
    {
        var fileStream = labelFile.OpenReadStream();
        StreamContent streamContent = new StreamContent(fileStream);

        var json = JsonSerializer.Serialize(variables);

        var content = new MultipartFormDataContent
        {
            { streamContent, "label" },
            { new StringContent(json), "variables" },
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

        var result = await response.Content.ReadFromJsonAsync<List<Printer>>();

        if (result == null) throw new InvalidOperationException("Failed to deserialize printers response");

        return result;
    }

    public async Task PrintVariableLabelAsync(string labelPath, List<Dictionary<string, string>> variables, int quantity = 1, string? printerName = null)
    {
        var textParts = new Dictionary<string, string>
        {
            [VariablesPart] = JsonSerializer.Serialize(variables),
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
            [VariablesPart] = JsonSerializer.Serialize(variables)
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
            [VariablesPart] = JsonSerializer.Serialize(variables),
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
            [VariablesPart] = JsonSerializer.Serialize(variables),
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
            var message = $"NiceLabel API {endpoint} returned {(int)response.StatusCode} {response.StatusCode}: {body}";
            response.Dispose();
            throw new HttpRequestException(message);
        }

        return response;
    }
}
