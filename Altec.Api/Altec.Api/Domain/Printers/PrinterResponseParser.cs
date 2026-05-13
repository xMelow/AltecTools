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
        var blineSize = ParseDimensionDots(Get("BLINE SIZE"), dpi);
        var gapSizeOffset = gapParts.Length > 1 ? ParseDimensionDots(gapParts[1], dpi) : "0 mm";

        return new PrinterInfo(
            Dpi: dpi,
            Model: Get("MODEL"),
            Serial: Get("SERIAL"),
            Version: Get("VERSION"),
            Mileage: DotsToM(Get("MILAGE"), dpi),
            LabelCounter: ParseInt(Get("LABEL COUNTER")),
            MacAddressNet: Get("MAC ADDRESS NET"),
            IpAddressNet: Get("IP ADDRESS NET"),
            NetworkName: Get("NAME"),
            SensorType: Get("SENSOR TYPE"),
            Speed: ParseInt(Get("SPEED")),
            Density: ParseInt(Get("DENSITY")),
            LabelWidth: labelWidth,
            LabelHeight: labelHeight,
            GapSize: gapSize,
            GapSizeOffset: gapSizeOffset,
            BlineSize: blineSize,
            Direction: Get("DIRECTION"),
            Ribbon: Get("RIBBON"),
            Offset: ParseDimensionDots(Get("OFFSET"), dpi),
            ShiftX: ParseDimensionDots(Get("SHIFT X"), dpi),
            ShiftY: ParseDimensionDots(Get("SHIFT Y"), dpi),
            CountryCode: Get("COUNTRY CODE"),
            CodePage: Get("CODEPAGE"),
            GapOffset: ParseDimensionDots(Get("GAP OFFSET"), dpi)
        );
    }

    private string ParseDimensionDots(string value, int dpi)
    {
        if (dpi == 0 || !int.TryParse(value.Trim(), out var d)) return "0 mm";
        return $"{Math.Round(d * 25.4 / dpi, 2).ToString(CultureInfo.InvariantCulture)} mm";
    }

    private string DotsToM(string dots, int dpi)
    {
        if (dpi == 0 || !int.TryParse(dots.Trim(), out var d)) return "0 m";
        return $"{Math.Round(d * 25.4 / dpi / 1000.0, 2).ToString(CultureInfo.InvariantCulture)} m";
    }

    private string ParseMm(string value)
    {
        value = value.Trim();
        if (value.EndsWith("inch", StringComparison.OrdinalIgnoreCase))
        {
            var num = value[..^4].Trim();
            if (double.TryParse(num, NumberStyles.Float, CultureInfo.InvariantCulture, out var inches))
                return $"{Math.Round(inches * 25.4).ToString(CultureInfo.InvariantCulture)} mm";
        }
        else if (value.EndsWith("mm", StringComparison.OrdinalIgnoreCase))
        {
            var num = value[..^2].Trim();
            if (double.TryParse(num, NumberStyles.Float, CultureInfo.InvariantCulture, out var mm))
                return $"{Math.Round(mm).ToString(CultureInfo.InvariantCulture)} mm";
        }
        else if (double.TryParse(value, NumberStyles.Float, CultureInfo.InvariantCulture, out var raw))
        {
            return $"{raw} mm";
        }
        return "0 mm";
    }

    private int ParseInt(string? value)
    {
        if (int.TryParse(value?.Trim(), out var result)) return result;
        return 0;
    }
}