using Altec.Api.Domain.Printers.Communication;

namespace Altec.Api.Domain.Printers.Connections;

public interface IPrinterConnection
{
    Task Send(string command);
    Task<string> Read(string? terminator = null);
    Task SendFiles(IEnumerable<PrinterFile> files);
}