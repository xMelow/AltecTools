using System.Net;
using Altec.Api.Domain.Printers.Communication;
using Altec.Api.Domain.Printers.Connections;
using Altec.Api.Domain.Printers.Discovery;
using Altec.Api.Domain.Printers.Parsing;
using Altec.Api.Record.Printers;

namespace Altec.Api.Services.Printers;

public class PrinterService : IPrinterService
{
    private readonly WifiDiscovery _wifiDiscovery;
    private readonly PrinterResponseParser _parser;

    public PrinterService(WifiDiscovery wifiDiscovery, PrinterResponseParser parser)
    {
        _wifiDiscovery = wifiDiscovery;
        _parser = parser;
    }
    
    public async Task<IReadOnlyList<Printer>> GetPrinters(List<string> subnets)
    {
        var result = await _wifiDiscovery.Discover(subnets);
        return result;
    }

    public async Task<PrinterInfo> GetPrinterInfo(PrinterConnectionType connectionType, string address)
    {

        var connection = CreateConnection(connectionType, address);
        using var client = new PrinterClient(connection);
        var result = await client.SendCommand(PrinterCommands.GetAllSettings());
        return _parser.ParseSettings(result);
    }

    public async Task<string> SendCommand(PrinterConnectionType connectionType, string address, string command)
    {
        var connection = CreateConnection(connectionType, address);
        using var client = new PrinterClient(connection);
        return await client.SendCommand(command);
    }

    public async Task SendFiles(PrinterConnectionType connectionType, string address, IEnumerable<PrinterFile> files)
    {
        var connection = CreateConnection(connectionType, address);
        using var client = new PrinterClient(connection);
        await client.SendFile(files);
    }

    private IPrinterConnection CreateConnection(PrinterConnectionType connectionType, string address)
    {
        IPrinterConnection connection = connectionType switch
        {
            PrinterConnectionType.Wifi => new WifiConnector(IPAddress.Parse(address)),
            PrinterConnectionType.Usb => new UsbConnector(address),
            _ => throw new ArgumentException("Unknown connection type")
        };

        return connection;
    }
}