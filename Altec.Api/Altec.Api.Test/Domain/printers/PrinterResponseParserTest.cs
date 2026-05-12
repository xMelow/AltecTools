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

        var result = _parser.ParseSettings(response);

        Assert.Equal(300, result.Dpi);
        Assert.Equal("ATP-300", result.Model);
    }

    [Fact]
    public void ParseSettings_GapSizeWithNoPart_GapSizeOfssetDefaultsToZero()
    {
        var response = "DPI=300\nGAP SIZE=48";

        var result = _parser.ParseSettings(response);

        Assert.Equal("0 mm", result.GapSizeOffset);
        Assert.Equal("4.06 mm", result.GapSize);
    }

    [Fact]
    public void ParseSettings_GapSizeIsZero_GapSizeOfssetDefaultsToZero()
    {
        var response = "DPI=300\nGAP SIZE=48,0";

        var result = _parser.ParseSettings(response);

        Assert.Equal("0 mm", result.GapSizeOffset);
        Assert.Equal("4.06 mm", result.GapSize);
    }

    [Fact]
    public void ParseSettings_BlineSizeInch_ConvertsToMm()
    {
        var response = "DPI=300\nBLINE SIZE=3inch";

        var result = _parser.ParseSettings(response);

        Assert.Equal("76 mm", result.BlineSize);
    }

    [Fact]
    public void ParseSettings_BlineSizeMm_ConvertsToMm()
    {
        var response = "DPI=300\nBLINE SIZE=76mm";

        var result = _parser.ParseSettings(response);

        Assert.Equal("76 mm", result.BlineSize);
    }

    [Fact]
    public void ParseSettings_BlineSizeIsEmpty_DefaultsToZeroMm()
    {
        var response = "DPI=300\nBLINE SIZE=";

        var result = _parser.ParseSettings(response);

        Assert.Equal("0 mm", result.BlineSize);
    }

    [Fact]
    public void ParseSettings_BlineSizeIsMissing_DefaultsToZeroMm()
    {
        var response = "DPI=300";

        var result = _parser.ParseSettings(response);

        Assert.Equal("0 mm", result.BlineSize);
    }
}
