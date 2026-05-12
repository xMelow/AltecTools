using Altec.Api.Domain.Printers;
using Altec.Api.Record.Printers;

namespace Altec.Api.Test.Domain.printers;

public class PrinterDiscoveryTest
{
    private readonly PrinterResponseParser _parser = new();

    [Fact]
    public void ParseSettings_WithValidResponse_ReturnsPrinterInfo()
    {
        var response = "DPI=300\nMODEL=ATP-300";

        var settings = _parser.ParseSettings(response);

        Assert.Equal(300, settings.Dpi);
        Assert.Equal("ATP-300", settings.Model);
    }
}
