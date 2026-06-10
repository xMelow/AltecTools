
using System.Management;
using Altec.Api.Record.Printers;

namespace Altec.Api.Domain.Printers.Discovery;

public class UsbDiscovery
{
    

    public IReadOnlyList<Printer> Discover()
    {
        if (!System.OperatingSystem.IsWindows())
        {
            throw new PlatformNotSupportedException("USB discovery is only supported on Windows.");
        }

        var query = new ManagementObjectSearcher("SELECT * FROM Win32_printer");

        var printers = query.Get()
                    .Cast<ManagementObject>()
                    .Where(p => p["PortName"]?.ToString().Contains("USB") == true)
                    .Select(p => new Printer(p["Name"]?.ToString() ?? "Unknown", p["PortName"]?.ToString() ?? "Unknown", p["DriverName"]?.ToString() ?? "Unknown", Communication.PrinterConnectionType.Usb))
                    .ToList();

        return printers;
    }
}