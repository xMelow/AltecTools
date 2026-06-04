using System.Net;
using System.Net.Sockets;
using System.Text;

namespace Altec.Api.Domain.Printers;

public class WifiPrinterClient : IPrinterConnection
{
    private IPAddress _ipAddress;
    private const int PrinterPort = 9100;

    public WifiPrinterClient(IPAddress IpAddress)
    {
        _ipAddress = IpAddress;
    }

    public string Read()
    {
        throw new NotImplementedException();
    }

    public void Send(string command)
    {
        throw new NotImplementedException();
    }
}
