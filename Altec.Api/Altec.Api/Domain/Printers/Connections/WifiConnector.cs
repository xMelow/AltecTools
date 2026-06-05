using System.Net;
using System.Net.Sockets;
using System.Text;
using Altec.Api.Domain.Printers.Communication;

namespace Altec.Api.Domain.Printers.Connections;

public class WifiConnector : IPrinterConnection, IDisposable
{
    private readonly TcpClient _client;
    private readonly NetworkStream _stream;
    private const int PrinterPort = 9100;
    
    public WifiConnector(IPAddress ipAddress)
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

    // public async Task<string> SendPrinterFiles(IPAddress ip, IEnumerable<(Stream stream, string fileName, string memory)> files)
    // {
    //     using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(30));
    //     using var client = new TcpClient();
    //     await client.ConnectAsync(ip, PrinterPort, cts.Token);
    //     using var tcpStream = client.GetStream();

    //     foreach (var (stream, fileName, memory) in files)
    //     {
    //         var memPrefix = memory switch { "F" => "F,", "E" => "E,", _ => "" };
    //         var ext = Path.GetExtension(fileName).ToUpperInvariant();

    //         if (ext == ".BAS")
    //         {
    //             var header = Encoding.ASCII.GetBytes($"DOWNLOAD {memPrefix}\"{fileName}\"\r\n");
    //             await tcpStream.WriteAsync(header, cts.Token);
    //             await stream.CopyToAsync(tcpStream, cts.Token);
    //             await tcpStream.WriteAsync(Encoding.ASCII.GetBytes("\r\nEOP\r\n"), cts.Token);
    //         }
    //         else
    //         {
    //             using var ms = new MemoryStream();
    //             await stream.CopyToAsync(ms, cts.Token);
    //             var fileBytes = ms.ToArray();
    //             var header = Encoding.ASCII.GetBytes($"DOWNLOAD {memPrefix}\"{fileName}\",{fileBytes.Length},");
    //             await tcpStream.WriteAsync(header, cts.Token);
    //             await tcpStream.WriteAsync(fileBytes, cts.Token);
    //             await tcpStream.WriteAsync(Encoding.ASCII.GetBytes("\r\n"), cts.Token);
    //         }
    //     }

    //     await tcpStream.FlushAsync(cts.Token);
    //     return "File sent successfully";
    // }

    public void Dispose()
    {
        _client.Dispose();
        _stream.Dispose();
    }
}
