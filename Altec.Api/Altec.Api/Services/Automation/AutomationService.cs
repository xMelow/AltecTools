using Altec.Api.Record.NiceLabel;
using Altec.Api.Services.NiceLabel;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;

namespace Altec.Api.Services.Automation;

public class AutomationService : IAutomationService
{
    private readonly IConfiguration _config;
    private readonly INiceLabelClient _niceLabel;

    public AutomationService(IConfiguration config, INiceLabelClient niceLabel)
    {
        _config = config;
        _niceLabel = niceLabel;
    }

    public async Task PrintSerialNumbers(IFormFile csvFile, string printerType, string? printerName)
    {
        var serialNumbers = ReadCsvData(csvFile, printerType);
        var variables = BuildSerialNumberVariables(serialNumbers);

        await _niceLabel.PrintVariableLabelAsync(SerialNumbersLabelPath, variables, printerName);
    }

    public async Task<List<string>> PreviewSerialNumbers(IFormFile csvFile, string printerType)
    {
        const int labelsPerPage = 10;
        var serialNumbers = ReadCsvData(csvFile, printerType).Take(labelsPerPage).ToList();
        var variables = BuildSerialNumberVariables(serialNumbers);

        var labelImages = await _niceLabel.PreviewVariableLabelsAsync(SerialNumbersLabelPath, variables);

        return ComposeLabelsIntoPages(labelImages, labelsPerPage);
    }

    public async Task PrintSdCardLabel(string orderNumber, string version, int amount)
    {
        var variables = Enumerable.Repeat(BuildSdCardVariables(orderNumber, version), amount).ToList();

        await _niceLabel.PrintVariableLabelAsync(SdCardLabelPath, variables);
    }

    public async Task<string> SdCardLabelPreview(string orderNumber, string version)
    {
        var variables = new List<Dictionary<string, string>> { BuildSdCardVariables(orderNumber, version) };

        var labelImages = await _niceLabel.PreviewVariableLabelsAsync(SdCardLabelPath, variables);

        return Convert.ToBase64String(labelImages[0]);
    }

    public async Task PrintTestRoomLabel(string sensorType, int speed, int density, bool cutter, bool userLabel, string printer)
    {
        var (totalLabels, labelVariables, printSettings) = BuildTestRoomData(speed, density, cutter, userLabel, printer);
        var labelPaths = ResolveTestRoomLabelPaths(sensorType, totalLabels);

        await _niceLabel.PrintBatchAsync(labelPaths, labelVariables, printSettings, printer);
    }

    public async Task PrintQlickPrintLicensie(IFormFile dataFile)
    {
        var variables = ReadBarcodeData(dataFile);

        await _niceLabel.PrintVariableLabelAsync(_config["LabelPaths:QlickPrintATP"], variables);
        await _niceLabel.PrintVariableLabelAsync(_config["LabelPaths:QlickPrintA4"], variables);
    }

    public async Task GeneratePDF(
        string language,
        string ticketNumber,
        string company,
        string contactPerson,
        string contactPersonPrefix,
        List<string> dontSendItems,
        string? overige,
        bool multiplePrinters,
        string model,
        string street,
        string problem1,
        string? problem2,
        string place,
        string serieNumber,
        string warrenty
    ) {
        var rmaLabelPath = ResolveRmaLabelPath(language);
        var sendLabelPath = ResolveSendLabelPath(language);
        var outputFileName = BuildRmaPdfPath(multiplePrinters, ticketNumber, serieNumber);
        var labelVariables = BuildRmaLabelVariables(
            ticketNumber, company, contactPerson, contactPersonPrefix, model, street,
            problem1, problem2, place, serieNumber, warrenty, overige, dontSendItems);

        await _niceLabel.PrintToPdfAsync(
            [rmaLabelPath, sendLabelPath], labelVariables, outputFileName, appendToFile: true);
    }

    private string SerialNumbersLabelPath => _config["LabelPaths:SerialNewPrintersLabel"];
    private string SdCardLabelPath => _config["LabelPaths:SdCard"];

    private static List<Dictionary<string, string>> BuildSerialNumberVariables(List<SerialNumberData> serialNumbers) =>
        serialNumbers.Select(serialData => new Dictionary<string, string>
        {
            ["sn"] = serialData.SerialNumber,
            ["mac"] = serialData.MacAddress,
            ["type"] = serialData.Type
        }).ToList();

    private static Dictionary<string, string> BuildSdCardVariables(string orderNumber, string version) => new()
    {
        ["Order nummer"] = orderNumber,
        ["Versie"] = version
    };

    private List<SerialNumberData> ReadCsvData(IFormFile csvFile, string printerType)
    {
        using var reader = new StreamReader(csvFile.OpenReadStream());
        var serialNumbersList = new List<SerialNumberData>();
        string? line;
        bool isFirstLine = true;
        var lineNumber = 0;

        while ((line = reader.ReadLine()) != null)
        {
            lineNumber++;
            if (isFirstLine) { isFirstLine = false; continue; }
            var parts = line.Split(";");
            if (parts.Length < 2) throw new ArgumentException($"Unable to parse: line:{lineNumber}");

            serialNumbersList.Add(new SerialNumberData(parts[0].Trim(), parts[1].Trim(), printerType));
        }
        return serialNumbersList
            .OrderBy(serialData => int.Parse(new string(serialData.SerialNumber.Where(char.IsDigit).ToArray())))
            .ToList();
    }

    private List<Dictionary<string, string>> ReadBarcodeData(IFormFile dataFile)
    {
        using var reader = new StreamReader(dataFile.OpenReadStream());
        var barcodes = new List<long>();
        string? line;
        var lineNumber = 0;

        while ((line = reader.ReadLine()) != null)
        {
            lineNumber++;
            try
            {
                barcodes.Add(long.Parse(line));
            }
            catch (FormatException ex)
            {
                throw new FormatException($"Unable to parse barcode: {lineNumber}", ex);
            }
        }

        return barcodes
            .OrderBy(barcode => barcode)
            .Select(barcode => new Dictionary<string, string> { ["barcode"] = barcode.ToString() })
            .ToList();
    }

    private List<string> ComposeLabelsIntoPages(List<byte[]> labelImages, int labelsPerPage)
    {
        var pages = labelImages.Chunk(labelsPerPage);
        List<string> result = new List<string>();

        foreach (var pageChunk in pages)
        {
            using var ms = new MemoryStream();
            using var firstLabel = Image.Load(pageChunk[0]);
            int labelWidth = firstLabel.Width;
            int labelHeight = firstLabel.Height;

            using var page = new Image<Rgba32>(labelWidth, labelHeight * labelsPerPage);

            for (int i = 0; i < pageChunk.Length; i++)
            {
                using var labelImage = Image.Load(pageChunk[i]);
                int yPosition = i * labelHeight;
                page.Mutate(ctx => ctx.DrawImage(labelImage, new Point(0, yPosition), 1f));
            }
            page.SaveAsPng(ms);
            result.Add(Convert.ToBase64String(ms.ToArray()));
        }
        return result;
    }

    private (int totalLabels, Dictionary<string, string> labelVariables, Dictionary<string, string> printSettings) BuildTestRoomData(
        int speed, int density, bool cutter, bool userLabel, string printer)
    {
        var totalLabels = userLabel ? 5 : 4;
        var printSettings = new Dictionary<string, string>
        {
            ["PrintSpeed"] = speed.ToString(),
            ["PrintDarkness"] = density.ToString()
        };
        var labelVariables = new Dictionary<string, string>
        {
            ["cutLabel"] = cutter.ToString(),
            ["PrinterTeGebruiken"] = printer
        };

        return (totalLabels, labelVariables, printSettings);
    }

    private List<string> ResolveTestRoomLabelPaths(string sensorType, int totalLabels)
    {
        var labelPaths = new List<string>();
        for (int labelNumber = 1; labelNumber <= totalLabels; labelNumber++)
        {
            var sensorLabel = AssignLabelSensor(sensorType, labelNumber);
            labelPaths.Add(_config[$"LabelPaths:Testlabel-{sensorLabel}-{labelNumber}"]);
        }
        return labelPaths;
    }

    private string AssignLabelSensor(string sensor, int labelNumber)
    {
        if (sensor == "BOTH")
        {
            if (labelNumber is 1 or 2 or 4) return "Gap";
            else return "Mark";
        }

        return sensor;
    }

    private string ResolveRmaLabelPath(string language) => language switch
    {
        "NL" => _config["LabelPaths:RMALabelNL"],
        "EN" => _config["LabelPaths:RMALabelEN"],
        "FR" => _config["LabelPaths:RMALabelFR"],
        _ => throw new ArgumentException($"Unsupported language: {language}")
    };

    private string ResolveSendLabelPath(string language) => language switch
    {
        "NL" => _config["LabelPaths:ZendLabel"],
        "EN" => _config["LabelPaths:ZendLabelENG"],
        "FR" => _config["LabelPaths:ZendLabelFR"],
        _ => throw new ArgumentException($"Unsupported language: {language}")
    };

    private string BuildRmaPdfPath(bool multiplePrinters, string ticketNumber, string serieNumber)
    {
        const string pdfDirectory = @"I:\ALTLabels\Nicelabel2017\NLCustomSystems\RMA\PDF";
        var fileName = multiplePrinters ? $"{ticketNumber}_{serieNumber}.pdf" : $"{ticketNumber}.pdf";
        return Path.Combine(pdfDirectory, fileName);
    }

    private static Dictionary<string, string> BuildRmaLabelVariables(
        string ticketNumber, string company, string contactPerson, string contactPersonPrefix,
        string model, string street, string problem1, string? problem2, string place,
        string serieNumber, string warrenty, string? overige, List<string> dontSendItems)
    {
        var labelVariables = new Dictionary<string, string>
        {
            ["Ticketnummer"] = ticketNumber,
            ["Naam bedrijf"] = company,
            ["Contactpersoon"] = contactPerson,
            ["heer/vrouw"] = contactPersonPrefix,
            ["Model"] = model,
            ["Straat"] = street,
            ["probregel1"] = problem1,
            ["probregel2"] = problem2,
            ["Plaats"] = place,
            ["Serienummer"] = serieNumber,
            ["Warranty"] = warrenty,
            ["overige1"] = overige,
            ["overige"] = string.IsNullOrEmpty(overige) ? "False" : "True"
        };

        foreach (var item in dontSendItems)
        {
            var labelVariable = item is "Inkt folie" or "Inkt cartridge" ? "Inktlint" : item;
            labelVariables[labelVariable] = "True";
        }

        return labelVariables;
    }
}
