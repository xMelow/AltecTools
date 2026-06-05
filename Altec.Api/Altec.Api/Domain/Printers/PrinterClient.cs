namespace Altec.Api.Domain.Printers;

public class PrinterClient : IDisposable
{
    private readonly IPrinterConnection _printerConnection;

    public PrinterClient(IPrinterConnection printerConnection)
    {
        _printerConnection = printerConnection;
    }

    public string SendCommand(string command)
    {
        _printerConnection.Send(command);
        return _printerConnection.Read();
    }

    public void Dispose()
    {
        if (_printerConnection is IDisposable disposable)
            disposable.Dispose();
    }
}
