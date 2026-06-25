using System.Text;
using System.Runtime.InteropServices;
using Microsoft.Win32.SafeHandles;
using Altec.Api.Domain.Printers.Communication;

namespace Altec.Api.Domain.Printers.Connections;

public class UsbConnector : IDisposable, IPrinterConnection
{

    [DllImport("kernel32.dll", CharSet = CharSet.Auto, SetLastError = true)]
    private static extern SafeFileHandle CreateFile(
        string lpFileName,
        uint dwDesiredAccess,
        uint dwShareMode,
        IntPtr lpSecurityAttributes,
        uint dwCreationDisposition,
        uint dwFlagsAndAttributes,
        IntPtr hTemplateFile
    );

    private const uint GENERIC_READ = 0x80000000;
    private const uint GENERIC_WRITE = 0x40000000;
    private const uint FILE_SHARE_READ = 0x01;
    private const uint FILE_SHARE_WRITE = 0x02;
    private const uint OPEN_EXISTING = 3;
    private const uint FILE_FLAG_OVERLAPPED = 0x40000000;
    private readonly SafeFileHandle _handle;
    private readonly FileStream _stream;

    public UsbConnector(string devicePath)
    {
        _handle = CreateFile(
            devicePath,
            GENERIC_READ | GENERIC_WRITE,
            FILE_SHARE_READ | FILE_SHARE_WRITE,
            IntPtr.Zero,
            OPEN_EXISTING,
            FILE_FLAG_OVERLAPPED,
            IntPtr.Zero);

        if (_handle.IsInvalid)
            throw new IOException($"Could not open USB device at {devicePath} (error {Marshal.GetLastWin32Error()})");

        _stream = new FileStream(_handle, FileAccess.ReadWrite, bufferSize: 4096, isAsync: true);
    }

    public async Task<string> Read()
    {
        using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(5));
        var sb = new StringBuilder();

        while (true)
        {
            var buffer = new byte[4096];
            var readTask = _stream.ReadAsync(buffer, cts.Token).AsTask();
            var timeoutTask = Task.Delay(TimeSpan.FromSeconds(1), cts.Token);
            var completed = await Task.WhenAny(readTask, timeoutTask);

            if (completed == readTask)
            {
                var bytesRead = await readTask;
                var result = Encoding.ASCII.GetString(buffer, 0, bytesRead);
                sb.Append(result);
            }
            else
            {
               return sb.ToString();
            }
        }
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
            throw new IOException("Unable to send command using USB", ex);
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
            throw new IOException("Unable to send files to printer via USB.", ex);
        }
    }
    
    public void Dispose()
    {
        _stream.Dispose();
        _handle.Dispose();
    }
}
