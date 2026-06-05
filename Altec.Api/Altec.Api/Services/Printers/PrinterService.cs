using System.Net;
using Altec.Api.Domain.Printers.Communication;
using Altec.Api.Domain.Printers.Connections;
using Altec.Api.Domain.Printers.Discovery;
using Altec.Api.Domain.Printers.Parsing;
using Altec.Api.Record.Printers;
using DocumentFormat.OpenXml.Office2016.Drawing.ChartDrawing;

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

    public void SendCommand(PrinterConnectionType connectionType, string address, string command)
    {
        var connection = CreateConnection(connectionType, address);
        using var client = new PrinterClient(connection);
        client.SendCommand(command);
    }

    public void SendFiles(PrinterConnectionType connectionType, string address, IEnumerable<PrinterFile> files)
    {
        var connection = CreateConnection(connectionType, address);
        using var client = new PrinterClient(connection);
        client.SendFile(files);
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