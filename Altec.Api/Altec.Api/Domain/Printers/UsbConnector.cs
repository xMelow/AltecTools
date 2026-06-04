using System.Text;

namespace Altec.Api.Domain.Printers;

public class UsbConnector
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

    public void Send(string command)
    {
        var bytes = Encoding.ASCII.GetBytes(command);
        
        try
        {
            _stream.Write(bytes, 0, bytes.Length);
        }
        catch (IOException ex)
        {
            throw new IOException("Unable to send command to printer.", ex);
        }
    }

    public string Read()
    {
        var buffer = new byte[1024];

        try
        {
            var bytesRead = _stream.Read(buffer, 0, buffer.Length);
            var result = Encoding.ASCII.GetString(buffer, 0, bytesRead);
            return result;
        }
        catch (IOException ex)
        {
            throw new IOException("Unable to read data from the printer", ex);
        }
    }
}
