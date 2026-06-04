namespace Altec.Api.Domain.Printers;

public interface IPrinterConnection
{
    void Send(string command);
    string Read();
}