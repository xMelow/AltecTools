namespace Altec.Api.Domain.Printers;

public class PrinterClient
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
}
