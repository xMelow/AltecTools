using System.Text;
using Altec.Api.Domain.Printers.Communication;
using System.Runtime.InteropServices;

namespace Altec.Api.Domain.Printers.Connections;

public class UsbConnector : IDisposable, IPrinterConnection
{
    [DllImport("winspool.drv", CharSet = CharSet.Unicode, SetLastError = true)]
    private static extern bool OpenPrinter(string printerName, out IntPtr hPrinter, IntPtr pd);

    [DllImport("winspool.drv", SetLastError = true)]
    private static extern bool ClosePrinter(IntPtr hPrinter);

    [DllImport("winspool.drv", CharSet = CharSet.Unicode, SetLastError = true)]
    private static extern bool StartDocPrinter(IntPtr hPrinter, int level, ref DOCINFO docInfo);

    [DllImport("winspool.drv", SetLastError = true)]
    private static extern bool EndDocPrinter(IntPtr hPrinter);

    [DllImport("winspool.drv", SetLastError = true)]
    private static extern bool StartPagePrinter(IntPtr hPrinter);

    [DllImport("winspool.drv", SetLastError = true)]
    private static extern bool EndPagePrinter(IntPtr hPrinter);

    [DllImport("winspool.drv", SetLastError = true)]
    private static extern bool WritePrinter(IntPtr hPrinter, byte[] data, int bufferSize, out int bytesWritten);

    [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Unicode)]
    private struct DOCINFO
    {
        [MarshalAs(UnmanagedType.LPWStr)] public string pDocName;
        [MarshalAs(UnmanagedType.LPWStr)] public string pOutputFile;
        [MarshalAs(UnmanagedType.LPWStr)] public string pDataType;
    }

    private IntPtr _hPrinter;

    public UsbConnector(string printerName)
    {
        if (!OpenPrinter(printerName, out _hPrinter, IntPtr.Zero)) 
            throw new IOException($"Could not open printer: {printerName}");
        
    }

    public Task Send(string command)
    {
        var docInfo = new DOCINFO { pDocName = "RawPrint", pOutputFile = null, pDataType = "RAW" };

        if (!StartDocPrinter(_hPrinter, 1, ref docInfo))
             throw new IOException($"Could not start doc printer");

        if (!StartPagePrinter(_hPrinter))
            throw new IOException($"Could not start page printer");

        var commandBytes = Encoding.ASCII.GetBytes(command);

        if (!WritePrinter(_hPrinter, commandBytes, commandBytes.Length, out _))
            throw new IOException("Unable to send command to the printer");
        
        EndPagePrinter(_hPrinter);
        EndDocPrinter(_hPrinter);

        return Task.CompletedTask;
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

        var docInfo = new DOCINFO { pDocName = "RawPrint", pOutputFile = null, pDataType = "RAW" };

        if (!StartDocPrinter(_hPrinter, 1, ref docInfo))
             throw new IOException($"Could not start doc printer");

        if (!StartPagePrinter(_hPrinter))
            throw new IOException($"Could not start page printer");

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

                    // await _stream.WriteAsync(header);

                    // what does this exactly do??????
                    await file.Stream.CopyToAsync(_stream);
                    await _stream.WriteAsync(Encoding.ASCII.GetBytes("\r\nEOP\r\n"));

                    if (!WritePrinter(_hPrinter, header, header.Length, out _))
                        throw new IOException("Unable to send command to the printer");


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

        EndPagePrinter(_hPrinter);
        EndDocPrinter(_hPrinter);
    }

    public void Dispose()
    {
        ClosePrinter(_hPrinter);
    }
}
