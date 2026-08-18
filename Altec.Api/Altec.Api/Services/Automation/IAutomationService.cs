namespace Altec.Api.Services.Automation;

public interface IAutomationService
{
    Task PrintSerialNumbers(IFormFile csvFile, string printerType, string? printerName);
    Task<List<string>> PreviewSerialNumbers(IFormFile csvFile, string printerType);
    Task PrintSdCardLabel(string orderNumber, string version, int amount);
    Task<string> SdCardLabelPreview(string orderNumber, string version);
}