using Altec.Api.Domain.Printers.Communication;
using Altec.Api.Record.Printers;

namespace Altec.Api.Services.Printers;

public interface IPrinterService
{
    Task<IReadOnlyList<Printer>> GetPrinters(List<string> subnets);
    PrinterInfo GetPrinterInfo(PrinterConnectionType connectionType, string address);
    void SendCommand(PrinterConnectionType connectionType, string address, string command);
    void SendFiles(PrinterConnectionType connectionType, string address, IEnumerable<PrinterFile> files);
}