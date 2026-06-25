using Altec.Api.Domain.Printers.Connections;

namespace Altec.Api.Domain.Printers.Communication;

public class PrinterClient : IDisposable
{
    private readonly IPrinterConnection _printerConnection;

    public PrinterClient(IPrinterConnection printerConnection)
    {
        _printerConnection = printerConnection;
    }

    public async Task<string> SendCommand(string command)
    {
        await _printerConnection.Send(command);
        return await _printerConnection.Read();
    }

    public async Task SendFile(IEnumerable<PrinterFile> files)
    {
        await _printerConnection.SendFiles(files);
    }

    public void Dispose()
    {
        if (_printerConnection is IDisposable disposable)
            disposable.Dispose();
    }
}
