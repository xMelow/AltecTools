using Altec.Api.Domain.Printers;

namespace Altec.Api.Test.Domain.printers;

public class PrinterDiscoveryTest
{
    private readonly PrinterResponseParser _parser = new();

    [Fact]
    public void ParseSettings_WithValidResponse_ReturnsPrinterInfo()
    {
        var response = "DPI=300\nMODEL=ATP-300 PRO\n...";

        _parser.ParseSettings(response);
    }
}