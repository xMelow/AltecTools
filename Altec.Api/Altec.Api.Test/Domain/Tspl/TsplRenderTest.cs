using Altec.Api.Domain.Tspl;
using Altec.Api.Records;
using Xunit.Abstractions;

namespace Altec.Api.Test.Domain.Tspl;

public class TsplRenderTest
{
    private readonly TsplRender _render = new();
    private readonly TsplParser _parser = new();
    private readonly ITestOutputHelper _output;

    public TsplRenderTest(ITestOutputHelper output)
    {
        _output = output;
    }

    [Fact]
    public void Render_TextCommand_SavesToPng()
    {
        var commands = new List<TsplDrawCommand>
        {
            new("SIZE", new List<string> { "103", "110" }),
            new("TEXT", new List<string> { "10", "10", "0", "0", "16", "16", "Hello Altec" })
        };

        var (imageBytes, _, _) = _render.Render(commands, false, null);

        File.WriteAllBytes("C:/temp/test_label.png", imageBytes);
        Assert.NotEmpty(imageBytes);
    }

    [Fact]
    public void Render_ParkingLabel_SavesToPng()
    {
        const string tspl = "SIZE 100 mm,295 mm\n" +
            "GAP 0.00 mm, 0.00 mm\n" +
            "REFERENCE 0,0\n" +
            "DIRECTION 0,0\n" +
            "CLS\n" +
            "QRCODE 685,2930,Q,14,A,90,M2,S7,\"https://beta-app.eaglebe.com/nl-be/map/details/1020150\"\n" +
            "TEXT 1135,46,\"0\",90,36,36,\"VAN\"\n" +
            "TEXT 1135,1775,\"0\",90,36,36,\"T.E.M\"\n" +
            "TEXT 990,46,\"0\",90,80,80,\"31/07/2025\"\n" +
            "TEXT 990,1775,\"0\",90,80,80,\"31/07/2025\"\n" +
            "TEXT 650,2105,\"0\",90,80,80,\"20:00\"\n" +
            "TEXT 650,376,\"0\",90,80,80,\"7:04\"\n" +
            "TEXT 590,1775,\"0\",90,36,36,\"TOT\"\n" +
            "TEXT 590,46,\"0\",90,36,36,\"VAN\"\n" +
            "TEXT 300,525,\"0\",90,30,30,\"UITGEZONDERD VERGUNNINGSHOUDERS\"\n" +
            "TEXT 150,500,\"0\",90,30,30,\"ENKEL GELDIG OP WERKDAGEN (MA-VRIJ)\"\n" +
            "PRINT 1\n";

        var commands = _parser.Parse(tspl);
        var (imageBytes, width, height) = _render.Render(commands, false, new Dictionary<string, string>());

        File.WriteAllBytes("C:/temp/parking_label.png", imageBytes);
        _output.WriteLine($"width={width}mm height={height}mm");
        Assert.NotEmpty(imageBytes);
    }

    [Fact]
    public void Render_FullTsplLabel_SavesToPng()
    {
        var commands = new List<TsplDrawCommand>
        {
            new("SIZE", new List<string> { "103", "103" }),
            new("TEXT", new List<string> { "427", "47", "0", "0", "16", "16", "Hello World" }),
            new("BAR", new List<string> { "33", "135", "1199", "7" }),
            new("BOX", new List<string> { "33", "178", "1232", "890", "6" }),
            new("QRCODE", new List<string> { "938", "951", "L", "14", "A", "0", "M2", "S7", "123456789012" }),
            new("CIRCLE", new List<string> { "933", "590", "260", "12" }),
            new("TEXT", new List<string> { "77", "234", "0", "0", "16", "16", "Name:" }),
            new("TEXT", new List<string> { "77", "322", "0", "0", "16", "16", "Phone number:" }),
            new("TEXT", new List<string> { "77", "413", "0", "0", "16", "16", "Email:" }),
            new("TEXT", new List<string> { "77", "505", "0", "0", "16", "16", "Company:" }),
            new("TEXT", new List<string> { "295", "231", "0", "0", "16", "16", "flor" }),
            new("TEXT", new List<string> { "509", "320", "0", "0", "16", "16", "+32468294226" }),
            new("TEXT", new List<string> { "295", "410", "0", "0", "16", "16", "flor@altec.be" }),
            new("TEXT", new List<string> { "396", "502", "0", "0", "16", "16", "Altec" }),
        };

        var (imageBytes, _, _) = _render.Render(commands, false, null);

        File.WriteAllBytes("C:/temp/testLabel.png", imageBytes);
        Assert.NotEmpty(imageBytes);
    }

    [Fact]
    public void Render_FullComplicatedTsplLabel_SavesToPng()
    {
        var commands = new List<TsplDrawCommand>
        {
            new("SIZE", new List<string> { "80", "101" }),
            new("BLOCK", new List<string> { "45", "300", "800", "60", "0", "0", "50", "60", "0", "2", "100" }),
            new("BLOCK", new List<string> { "32", "550", "800", "50", "0", "0", "26", "26", "Altec" }),
            new("BLOCK", new List<string> { "32", "680", "800", "250", "0", "0", "26", "26", "0", "1", "1", "Poduim boom altec"}),
            new("TEXT", new List<string> { "32", "960", "0", "0", "12", "14", "DATUM IN:" }),
            new("BLOCK", new List<string> { "32", "1025", "800", "50", "0", "0", "22", "22", "01/01/2026" }),
            new("QRCODE", new List<string> { "700", "900", "L", "10", "A", "0", "M2", "S7", "132465789" }),
        };

        var (imageBytes, _, _) = _render.Render(commands, true, null);

        File.WriteAllBytes("C:/temp/testLabel.png", imageBytes);
        Assert.NotEmpty(imageBytes);
    }

    [Fact]
    public void Render_Label3()
    {
        var commands = new List<TsplDrawCommand>
        {
            new("SIZE", new List<string> { "100", "50" }),
            new("BAR", new List<string> { "12", "89", "1158", "5" }),
            new("BOX", new List<string> { "12", "104", "1170", "515", "5" }),
            new("TEXT", new List<string> { "1073", "30", "0", "0", "10", "10", "1" }),
            new("TEXT", new List<string> { "26", "30", "0", "0", "10", "10", "Flor Stellamans" }),
            new("TEXT", new List<string> { "26", "139", "0", "0", "10", "10", "Kerkstraat 55" }),
            new("TEXT", new List<string> { "26", "248", "0", "0", "12", "12", "1851 Humbeek" }),
            new("BARCODE", new List<string> { "33", "389", "128", "79", "2", "0", "4", "8", "+32468294226" }),
            new("QRCODE", new List<string> { "867", "218", "L", "11", "A", "0", "M2", "S7", "flor@stellamans.be" }),
        };

        var (imageBytes, _, _) = _render.Render(commands, true, null);

        File.WriteAllBytes("C:/temp/testLabel.png", imageBytes);
        Assert.NotEmpty(imageBytes);
    }
}