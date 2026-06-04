using System.Net;
using System.Net.Sockets;
using System.Text;

namespace Altec.Api.Domain.Printers;

public class WifiPrinterClient : IPrinterConnection, IDisposable
{
    private readonly TcpClient _client;
    private readonly NetworkStream _stream;
    private const int PrinterPort = 9100;
    
    public WifiPrinterClient(IPAddress ipAddress)
    {
        using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(5));
        _client = new TcpClient();
        _client.ConnectAsync(ipAddress, PrinterPort, cts.Token).GetAwaiter().GetResult();
        _stream = _client.GetStream();
    }

    public string Read()
    {
        throw new NotImplementedException();
    }

    public void Send(string command)
    {
       try
        {
            using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(5));
            var data = Encoding.ASCII.GetBytes(command + "\r\n");
            _stream.WriteAsync(data, cts.Token).GetAwaiter().GetResult();
        }
        catch (IOException ex)
        {
            throw new IOException("Unable to send command using Wifi", ex);
        }
    }

    public void Dispose()
    {
        _client.Dispose();
        _stream.Dispose();
    }
}
