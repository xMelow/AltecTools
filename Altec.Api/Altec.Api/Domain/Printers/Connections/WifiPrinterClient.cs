using System.Net;
using System.Net.Sockets;
using System.Text;
using Altec.Api.Domain.Printers.Communication;

namespace Altec.Api.Domain.Printers.Connections;

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
        using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(5));
        var buffer = new byte[4096];
        var readTask = _stream.ReadAsync(buffer, cts.Token).AsTask();
        var timeoutTask = Task.Delay(TimeSpan.FromSeconds(1), cts.Token);
        
        var completed = Task.WhenAny(readTask, timeoutTask).GetAwaiter().GetResult();
        if (completed != readTask)
            return "Printer didn't respond in time.";
            
        var bytesRead = readTask.GetAwaiter().GetResult();
        return Encoding.ASCII.GetString(buffer, 0, bytesRead);
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

    public void SendFiles(IEnumerable<PrinterFile> files)
    {
        throw new NotImplementedException();
    }

    public void Dispose()
    {
        _client.Dispose();
        _stream.Dispose();
    }
}
