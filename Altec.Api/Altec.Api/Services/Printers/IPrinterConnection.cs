namespace Altec.Api.Services.Printers;

public interface IPrinterConnection
{
    void Send(string command);
    string Read();
}