using Altec.Api.Domain.Printers.Communication;
using Altec.Api.Record.Printers;

namespace Altec.Api.Services.Printers;

public interface IPrinterService
{
    Task<IReadOnlyList<Printer>> GetPrinters(PrinterConnectionType connectionType, List<string>? subnets);
    Task<PrinterInfo> GetPrinterInfo(PrinterConnectionType connectionType, string address);
    Task<string> SendCommand(PrinterConnectionType connectionType, string address, string command);
    Task SendFiles(PrinterConnectionType connectionType, string address, IEnumerable<PrinterFile> files);
}