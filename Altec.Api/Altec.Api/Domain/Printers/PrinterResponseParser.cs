using System.Globalization;
using Altec.Api.Record.Printers;

namespace Altec.Api.Domain.Printers; 

public class PrinterResponseParser
{
    public PrinterInfo ParseSettings(string response)
    {
        var settings = response
            .Split('\n', StringSplitOptions.RemoveEmptyEntries)
            .Select(l => l.Trim())
            .Where(l => l.Contains('='))
            .Select(l => l.Split('=', 2))
            .ToDictionary(parts => parts[0], parts => parts[1].Trim(), StringComparer.OrdinalIgnoreCase);

        string Get(string key) => settings.GetValueOrDefault(key, "");
        
        var dpi = ParseInt(Get("DPI"));

        var labelWidth = ParseDimensionDots(Get("PAPER WIDTH"), dpi);
        var labelHeight = ParseDimensionDots(Get("PAPER SIZE"), dpi);

        var gapParts = Get("GAP SIZE").Split(',');
        var gapSize = ParseDimensionDots(gapParts[0], dpi);

        return new PrinterInfo(
            Model: Get("MODEL"),
            Serial: Get("SERIAL"),
            Version: Get("VERSION"),
            CheckSum: Get("CHECK SUM"),
            Dpi: dpi,
            PrinterStatus: ParsePrinterStatus(Get("PRINTER STATUS")),
            Mileage: DotsToM(Get("MILAGE"), dpi),
            LabelCounter: ParseInt(Get("LABEL COUNTER")),
            CutterCounter: ParseInt(Get("CUT COUNTER")),
            MacAddressNet: Get("MAC ADDRESS NET"),
            IpAddressNet: Get("IP ADDRESS NET"),
            DnsName: Get("NAME"),
            SensorType: Get("SENSOR TYPE"),
            HeadOpenSensor: Get("CARRIAGE"),
            GapSize: ParseDimensionDots(Get("GAP SIZE"), dpi),
            GapOffset: ParseDimensionDots(Get("GAP OFFSET"), dpi),
            Speed: ParseInt(Get("SPEED")),
            Density: ParseInt(Get("DENSITY")),
            LabelWidth: labelWidth,
            LabelHeight: labelHeight,
            BlineSize: ParseDimensionDots(Get("BLINE SIZE"), dpi),
            Direction: ParseInt(Get("DIRECTION")),
            Mirror: ParseInt(Get("MIRROR")),
            Ribbon: ParseOnOrOff(Get("RIBBON")),
            Offset: (int)Math.Round(ParseDimensionDots(Get("OFFSET"), dpi)),
            ShiftX: (int)Math.Round(ParseDimensionDots(Get("SHIFT X"), dpi)),
            ShiftY: (int)Math.Round(ParseDimensionDots(Get("SHIFT Y"), dpi)),
            ReferenceX: (int)Math.Round(ParseDimensionDots(Get("REFERENCE X"), dpi)),
            ReferenceY: (int)Math.Round(ParseDimensionDots(Get("REFERENCE Y"), dpi)),
            CountryCode: ParseInt(Get("COUNTRY CODE")),
            CodePage: ParseInt(Get("CODEPAGE"))
        );
    }

    private double ParseDimensionDots(string value, int dpi)
    {
        if (dpi == 0 || !int.TryParse(value.Trim(), out var d)) return 0;
        return Math.Round(d * 25.4 / dpi, 2);
    }

    private string DotsToM(string dots, int dpi)
    {
        if (dpi == 0 || !int.TryParse(dots.Trim(), out var d)) return "0 m";
        return $"{Math.Round(d * 25.4 / dpi / 1000.0, 2).ToString(CultureInfo.InvariantCulture)} m";
    }

    private int ParseInt(string? value)
    {
        if (int.TryParse(value?.Trim(), out var result)) return result;
        return 0;
    }

    private string ParsePrinterStatus(string value)
    {
        return "Ready";
    }

    private bool ParseOnOrOff(string value)
    {
        if (!int.TryParse(value?.Trim(), out var number))
            number = 0;

        if (number == 0) return false;
        return true;
    }

}
