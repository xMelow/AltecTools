using System.Net;
using Altec.Api.Domain.Printers;
using Altec.Api.Record.Printers;

namespace Altec.Api.Services.Printers;

public class PrinterService : IPrinterService
{
    private readonly PrinterDiscovery _printerDiscovery;
    private readonly PrinterResponseParser _parser;

    public PrinterService(PrinterDiscovery printerDiscovery, PrinterResponseParser parser)
    {
        _printerDiscovery = printerDiscovery;
        _parser = parser;
    }
    
    public async Task<IReadOnlyList<Printer>> GetPrinters(List<string> subnets)
    {
        var result = await _printerDiscovery.Discover(subnets);
        return result;
    }

    public PrinterInfo GetPrinterInfo(PrinterConnectionType connectionType, string address)
    {

        var connection = CreateConnection(connectionType, address);
        using var client = new PrinterClient(connection);
        var result = client.SendCommand(PrinterCommands.GetBasicInfo());
        return _parser.ParseSettings(result);
    }

    public string SendCommand(PrinterConnectionType connectionType, string address, string command)
    {
        var connection = CreateConnection(connectionType, address);
        using var client = new PrinterClient(connection);
        return client.SendCommand(command);
    }

    public async Task<string> SendFiles(string ipAddress, IEnumerable<(Stream stream, string fileName, string memory)> files)
    {
        var ip = IPAddress.Parse(ipAddress);
        return await _printerDiscovery.SendPrinterFiles(ip, files);
    }

    private IPrinterConnection CreateConnection(PrinterConnectionType connectionType, string address)
    {
        IPrinterConnection connection = connectionType switch
        {
            PrinterConnectionType.Wifi => new WifiPrinterClient(IPAddress.Parse(address)),
            PrinterConnectionType.Usb => new UsbConnector(address),
            _ => throw new ArgumentException("Unknown connection type")
        };

        return connection;
    }
}