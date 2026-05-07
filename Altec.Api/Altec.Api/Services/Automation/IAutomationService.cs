namespace Altec.Api.Services.Automation;

public interface IAutomationService
{
    Task PrintSerialNumbers(IFormFile excelFile, string printerType, string? printerName);
    Task<byte[]> PreviewSerialNumbers(IFormFile excelFile, string printerType, int width, int height);
}