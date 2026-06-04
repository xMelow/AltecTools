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
        // convert string into bytes[]
        // send the command in bytes to the file
        // FileStream.Send(bytes[])
        // if success return ok else return exception
    }

    public string Read()
    {
        var result = "";

        // read the data from the file
        // convert to string
        // return the result

        return result;
    }
}
