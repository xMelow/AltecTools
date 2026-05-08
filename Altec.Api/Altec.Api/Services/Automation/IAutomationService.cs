namespace Altec.Api.Services.Automation;

public interface IAutomationService
{
    Task PrintSerialNumbers(IFormFile excelFile, string printerType, string? printerName);
    Task<List<string>> PreviewSerialNumbers(IFormFile excelFile, string printerType);
}