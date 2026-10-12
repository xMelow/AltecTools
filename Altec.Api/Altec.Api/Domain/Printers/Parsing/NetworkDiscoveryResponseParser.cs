using System.Net;
using System.Text;
using Altec.Api.Domain.Printers.Communication;
using Altec.Api.Record.Printers;

namespace Altec.Api.Domain.Printers.Parsing;

public class NetworkDiscoveryResponseParser
{
    private const int ModelOffset = 52;
    private const int NameOffset = 84;
    private const int FieldLength = 16;
    private const int MinimumPayloadLength = NameOffset + FieldLength;

    public Printer? Parse(byte[] payload, IPEndPoint sender)
    {
        if (payload.Length < MinimumPayloadLength)
            return null;

        var model = ReadFixedString(payload, ModelOffset, FieldLength);
        var name = ReadFixedString(payload, NameOffset, FieldLength);

        return new Printer(name, sender.Address.ToString(), model, PrinterConnectionType.Wifi);
    }

    private string ReadFixedString(byte[] payload, int offset, int length)
    {
        var raw = Encoding.ASCII.GetString(payload, offset, length);
        return raw.TrimEnd('\0');
    }
}
