using Altec.Api.Record.Printers;

namespace Altec.Api.Services.NiceLabel;

public interface INiceLabelClient
{
    Task<List<Printer>> GetPrinters();

    Task<IReadOnlyList<string>> GetVariables(IFormFile labelFile);

    Task PrintLabel(IFormFile labelFile, int quantity, string? printerIpAddress);

    Task<byte[]> GetLabelPreview(IFormFile labelFile, Dictionary<string, string> variables, int width, int height);

    Task PrintVariableLabelAsync(string labelPath, List<Dictionary<string, string>> variables, int quantity = 1, string? printerName = null);

    Task<List<byte[]>> PreviewVariableLabelsAsync(string labelPath, List<Dictionary<string, string>> variables);

    Task PrintBatchAsync(IEnumerable<string> labelPaths, Dictionary<string, string> variables, Dictionary<string, string> printerSettings, string printerName);

    Task PrintToPdfAsync(IEnumerable<string> labelPaths, Dictionary<string, string> variables, string outputFileName, bool appendToFile);
}
