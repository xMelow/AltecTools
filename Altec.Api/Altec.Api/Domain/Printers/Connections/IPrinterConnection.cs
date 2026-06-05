using Altec.Api.Domain.Printers.Communication;

namespace Altec.Api.Domain.Printers.Connections;

public interface IPrinterConnection
{
    void Send(string command);
    string Read();
    void SendFiles(IEnumerable<PrinterFile> files);
}