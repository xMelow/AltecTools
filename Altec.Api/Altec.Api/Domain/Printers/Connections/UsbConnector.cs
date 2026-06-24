using System.Text;
using System.Runtime.InteropServices;
using Microsoft.Win32.SafeHandles;
using Altec.Api.Domain.Printers.Communication;

namespace Altec.Api.Domain.Printers.Connections;

public class UsbConnector : IDisposable, IPrinterConnection
{
    private const string AltecVendorId = "vid_1203";
    
    private readonly SafeFileHandle _handle;
    private readonly FileStream _stream;

    public UsbConnector()
    {
        // TODO
    }

    public async Task<string> Read() { /* TODO */ }
    public async Task Send(string command) { /* TODO */ }
    public async Task SendFiles(IEnumerable<PrinterFile> files) { /* TODO */ }
    public void Dispose() { /* TODO */ }
}