using System.Net;
using System.Text;
using Altec.Api.Domain.Printers.Communication;
using Altec.Api.Record.Printers;

namespace Altec.Api.Domain.Printers.Parsing;

/// <summary>
/// Parses the binary UDP discovery response payload (port 22368) into a Printer.
///
/// Reference payload captured in Wireshark (116 bytes, UDP payload only,
/// headers already stripped by the time UdpClient hands it to us):
///
///   offset  bytes
///   00-15   00 20 00 01 00 01 08 00 00 02 00 54 00 03 00 00
///   16-31   01 00 00 00 00 00 00 1b 82 82 57 77 00 00 00 00
///   32-47   00 00 00 00 00 00 00 00 0c 02 c0 a8 01 7e 5a db
///   48-63   02 00 41 54 50 2d 33 30 30 20 50 72 6f 00 00 00
///   64-79   00 32 2e 31 32 2e 41 33 32 00 00 00 00 00 00 00
///   80-95   00 50 52 4e 2d 46 6c 6f 72 00 00 00 00 00 00 00
///   96-115  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
///
/// The MAC address (00:1b:82:82:57:77) and the strings "ATP-300 Pro",
/// "2.12.A32" and "PRN-Flor" are all visible in there. TODO: figure out the
/// exact start offset + field length (they look like fixed-width,
/// null-padded blocks) for each of the fields below, the same way you found
/// the MAC/IP earlier by comparing bytes across the packet.
/// </summary>
public class NetworkDiscoveryResponseParser
{
    public Printer? Parse(byte[] payload, IPEndPoint sender)
    {
        if (payload.Length < /* TODO: minimum expected length */ 0)
            return null;

        // TODO: extract MAC address bytes -> format as "AA:BB:CC:DD:EE:FF" if you want to keep it
        var mac = ParseMacAddress(payload);

        // TODO: extract model, firmware version and name using
        // ReadFixedString (below) at the right offset/length for each.
        var model = string.Empty;
        var name = string.Empty;

        // sender.Address is the printer's IP - no need to parse it from the payload.
        return new Printer(name, sender.Address.ToString(), model, PrinterConnectionType.Wifi);
    }

    private string ParseMacAddress(byte[] payload)
    {
        // TODO
        throw new NotImplementedException();
    }

    /// <summary>
    /// Reads a fixed-width, null-padded ASCII string out of the payload.
    /// </summary>
    private string ReadFixedString(byte[] payload, int offset, int length)
    {
        var raw = Encoding.ASCII.GetString(payload, offset, length);
        return raw.TrimEnd('\0');
    }
}
