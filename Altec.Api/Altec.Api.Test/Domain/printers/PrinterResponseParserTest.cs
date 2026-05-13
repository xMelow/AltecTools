using Altec.Api.Domain.Printers;
using Altec.Api.Record.Printers;

namespace Altec.Api.Test.Domain.printers;

public class PrinterDiscoveryTest
{
    private readonly PrinterResponseParser _parser = new();

    [Fact]
    public void ParseSettings_WithValidFullResponse_ReturnsPrinterInfo()
    {
        var response =
            "DPI=300\n" +
            "MODEL=ATP-300\n" +
            "SERIAL=A1234567890\n" +
            "VERSION=V1.00.00\n" +
            "MILAGE=1234\n" +
            "LABEL COUNTER=5678\n" +
            "MAC ADDRESS NET=00:11:22:33:44:55\n" +
            "IP ADDRESS NET=192.168.1.100\n" +
            "NAME=MyPrinter\n" +
            "SENSOR TYPE=GAP\n" +
            "DENSITY=8\n" +
            "PAPER SIZE=1200\n" +
            "PAPER WIDTH=400\n" +
            "GAP SIZE=48,0\n" +
            "BLINE SIZE=0\n" +
            "DIRECTION=0\n" +
            "RIBBON=RIBBON\n" +
            "OFFSET=0\n" +
            "SHIFT X=0\n" +
            "SHIFT Y=0\n" +
            "SPEED=4\n" +
            "COUNTRY CODE=001\n" +
            "CODEPAGE=850\n" +
            "GAP OFFSET=118";
        var result = _parser.ParseSettings(response);

        Assert.Equal(300, result.Dpi);
        Assert.Equal("ATP-300", result.Model);
        Assert.Equal("A1234567890", result.Serial);
        Assert.Equal("V1.00.00", result.Version);
        Assert.Equal("0.1 m", result.Mileage);
        Assert.Equal(5678, result.LabelCounter);
        Assert.Equal("00:11:22:33:44:55", result.MacAddressNet);
        Assert.Equal("192.168.1.100", result.IpAddressNet);
        Assert.Equal("MyPrinter", result.NetworkName);
        Assert.Equal("GAP", result.SensorType);
        Assert.Equal(8, result.Density);
        Assert.Equal("101.6 mm", result.LabelHeight);
        Assert.Equal("33.87 mm", result.LabelWidth);
        Assert.Equal("4.06 mm", result.GapSize);
        Assert.Equal("0 mm", result.GapSizeOffset);
        Assert.Equal("0 mm", result.BlineSize);
        Assert.Equal("0", result.Direction);
        Assert.Equal("RIBBON", result.Ribbon);
        Assert.Equal("0 mm", result.Offset);
        Assert.Equal("0 mm", result.ShiftX);
        Assert.Equal("0 mm", result.ShiftY);
        Assert.Equal(4, result.Speed);
        Assert.Equal("001", result.CountryCode);
        Assert.Equal("850", result.CodePage);
        Assert.Equal("9.99 mm", result.GapOffset);
    }

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

    [Fact]
    public void ParseSettings_DpiIsZero_DefaultsToZeroMm()
    {
        var response = "DPI=0";
        var result = _parser.ParseSettings(response);

        Assert.Equal("0 mm", result.LabelWidth);
        Assert.Equal("0 mm", result.LabelHeight);
        Assert.Equal("0 mm", result.GapSize);
    }

    [Fact]
    public void ParseSettings_DpiIsMissing_DefaultsToZeroMm()
    {
        var response = "";
        var result = _parser.ParseSettings(response);

        Assert.Equal("0 mm", result.LabelWidth);
        Assert.Equal("0 mm", result.LabelHeight);
        Assert.Equal("0 mm", result.GapSize);
    }

    [Fact]
    public void ParseSettings_DpiIsNonNumeric_DefaultsToZeroMm()
    {
        var response = "DPI=zero";
        var result = _parser.ParseSettings(response);

        Assert.Equal("0 mm", result.LabelWidth);
        Assert.Equal("0 mm", result.LabelHeight);
        Assert.Equal("0 mm", result.GapSize);
    }
}
