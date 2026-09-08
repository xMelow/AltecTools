namespace Altec.Api.Services.Automation;

public interface IAutomationService
{
    Task PrintSerialNumbers(IFormFile csvFile, string printerType, string? printerName);
    Task<List<string>> PreviewSerialNumbers(IFormFile csvFile, string printerType);
    Task PrintSdCardLabel(string orderNumber, string version, int amount);
    Task<string> SdCardLabelPreview(string orderNumber, string version);
    Task PrintTestRoomLabel(string sensorType, int speed, int density, bool cutter, bool userLabel, string printer);
    Task PrintQlickPrintLicensie(IFormFile dataFile);
    Task GeneratePDF(string language, string ticketNumber, string company, string contactPerson, string contactPersonPrefix, List<string> dontSendItems, string overige, bool multiplePrinters, string model, string street, string problem1, string problem2, string place, string serieNumber, string warrenty);
}