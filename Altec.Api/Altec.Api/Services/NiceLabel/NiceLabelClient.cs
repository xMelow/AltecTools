using System.Text.Json;
using Altec.Api.Record.Printers;

namespace Altec.Api.Services.NiceLabel;

public class NiceLabelClient : INiceLabelClient
{
    private readonly HttpClient _httpClient;

    public NiceLabelClient(HttpClient httpClient, IConfiguration config)
    {
        _httpClient = httpClient;
    }

    public async Task<IReadOnlyList<string>> GetVariables(IFormFile labelFile)
    {
        var fileStream = labelFile.OpenReadStream();
        StreamContent streamContent = new StreamContent(fileStream);

        var request = new HttpRequestMessage(HttpMethod.Post, "/api/nicelabel/variables");
        request.Content = streamContent;
        
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
        
        var request = new HttpRequestMessage(HttpMethod.Post, "/api/nicelabel/printLabel");
        request.Content = content;
        
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
}
