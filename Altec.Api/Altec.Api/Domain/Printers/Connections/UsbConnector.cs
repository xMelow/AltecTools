using System.Text;
using Altec.Api.Domain.Printers.Communication;

namespace Altec.Api.Domain.Printers.Connections;

public class UsbConnector : IDisposable, IPrinterConnection
{
    private FileStream _stream;

    public UsbConnector(string portPath)
    {
       try
        {
            _stream = new FileStream(portPath, FileMode.Open, FileAccess.ReadWrite);
        }
        catch (IOException ex)
        {
            throw new IOException($"Could not open USB port: {portPath}.", ex);
        }
    }

    public async Task Send(string command)
    {
        var bytes = Encoding.ASCII.GetBytes(command);
        
        try
        {
            await _stream.WriteAsync(bytes, 0, bytes.Length);
        }
        catch (IOException ex)
        {
            throw new IOException("Unable to send command to printer via usb", ex);
        }
    }

    public async Task<string> Read()
    {
        var buffer = new byte[1024];

        try
        {
            var bytesRead = await _stream.ReadAsync(buffer, 0, buffer.Length);
            var result = Encoding.ASCII.GetString(buffer, 0, bytesRead);
            return result;
        }
        catch (IOException ex)
        {
            throw new IOException("Unable to read data from the printer", ex);
        }
    }
    
    public async Task SendFiles(IEnumerable<PrinterFile> files)
    {
        try
        {
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
                    await _stream.WriteAsync(header);
                    await file.Stream.CopyToAsync(_stream);
                    await _stream.WriteAsync(Encoding.ASCII.GetBytes("\r\nEOP\r\n"));
                }
                else
                {
                    using var ms = new MemoryStream();
                    await file.Stream.CopyToAsync(ms);
                    var fileBytes = ms.ToArray();
                    var header = Encoding.ASCII.GetBytes($"DOWNLOAD {memPrefix}\"{file.FileName}\",{fileBytes.Length},");
                    await _stream.WriteAsync(header);
                    await _stream.WriteAsync(fileBytes);
                    await _stream.WriteAsync(Encoding.ASCII.GetBytes("\r\n"));
                }
            }
        }
        catch (IOException ex)
        {
            throw new IOException("Unable to send file to printer via USB", ex);
        }
    }

    public void Dispose()
    {
        _stream?.Dispose();
    }
}
