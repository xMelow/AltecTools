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
    
    public WifiConnector(string address)
    {
        using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(5));
        _client = new TcpClient();
        _client.ConnectAsync(address, PrinterPort, cts.Token).GetAwaiter().GetResult();
        _stream = _client.GetStream();
    }

    public async Task<string> Read(string? terminator = null)
    {
        using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(5));
        var buffer = new byte[4096];

        if (terminator == null)
        {
            var readTask = _stream.ReadAsync(buffer, cts.Token).AsTask();
            var timeoutTask = Task.Delay(TimeSpan.FromSeconds(4), cts.Token);

            var completed = await Task.WhenAny(readTask, timeoutTask);
            if (completed != readTask)
                throw new InvalidDataException("Printer didn't respond in time.");

            var bytesRead = await readTask;
            return Encoding.ASCII.GetString(buffer, 0, bytesRead);
        }

        var response = new StringBuilder();
        while (!response.ToString().EndsWith(terminator))
        {
            var bytesRead = await _stream.ReadAsync(buffer, cts.Token);
            var data = Encoding.ASCII.GetString(buffer, 0, bytesRead);
            response.Append(data);
        }

        return response.ToString();
    }

    public async Task Send(string command)
    {
       try
        {
            using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(5));
            var data = Encoding.ASCII.GetBytes(command + "\r\n");
            await _stream.WriteAsync(data, cts.Token);
        }
        catch (IOException ex)
        {
            throw new IOException("Unable to send command using Wifi", ex);
        }
    }

    public async Task SendFiles(IEnumerable<PrinterFile> files)
    {
        try
        {
            using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(5));
            foreach (var file in files)
            {
                var memPrefix = file.Memory switch 
                    { 
                        PrinterMemory.Flash => "F,", 
                        PrinterMemory.Dram => "D,", 
                        PrinterMemory.Card => "C,", 
                        _ => "" 
                    };
                var extension = Path.GetExtension(file.FileName).ToUpperInvariant();

                if (extension == ".BAS")
                {
                    var header = Encoding.ASCII.GetBytes($"DOWNLOAD {memPrefix}\"{file.FileName}\"\r\n");
                    await _stream.WriteAsync(header, cts.Token);
                    await file.Stream.CopyToAsync(_stream, cts.Token);
                    await _stream.WriteAsync(Encoding.ASCII.GetBytes("\r\nEOP\r\n"), cts.Token);
                }
                else
                {
                    using var ms = new MemoryStream();
                    await file.Stream.CopyToAsync(ms, cts.Token);
                    var fileBytes = ms.ToArray();
                    var header = Encoding.ASCII.GetBytes($"DOWNLOAD {memPrefix}\"{file.FileName}\",{fileBytes.Length},");
                    await _stream.WriteAsync(header, cts.Token);
                    await _stream.WriteAsync(fileBytes, cts.Token);
                    await _stream.WriteAsync(Encoding.ASCII.GetBytes("\r\n"), cts.Token);
                }
            }

            await _stream.FlushAsync(cts.Token);
        }
        catch (IOException ex)
        {
            throw new IOException("Unable to send files to printer via Wifi.", ex);
        }
    }

    public void Dispose()
    {
        _client.Dispose();
        _stream.Dispose();
    }
}
