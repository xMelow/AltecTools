using Altec.Api.Record.Printers;

namespace Altec.Api.Services.NiceLabel;

public interface INiceLabelClient
{
    Task<IReadOnlyList<string>> GetVariables(IFormFile labelFile);
    Task PrintLabel(IFormFile labelFile,int quantity, string? printerIpAddress);
    Task<byte[]> GetLabelPreview(IFormFile labelFile, Dictionary<string, string> variables, int width, int height);
    Task<List<Printer>> GetPrinters();

    /// <summary>
    /// Prints one label template once per entry in <paramref name="variables"/>.
    /// </summary>
    Task PrintVariableLabelAsync(
        string labelPath,
        List<Dictionary<string, string>> variables,
        string? printerName = null);

    /// <summary>
    /// Renders (does not print) one label template once per entry in <paramref name="variables"/>,
    /// returning a PNG per rendered label.
    /// </summary>
    Task<List<byte[]>> PreviewVariableLabelsAsync(
        string labelPath,
        List<Dictionary<string, string>> variables);

    /// <summary>
    /// Prints a set of different label templates in a single job, applying the same
    /// variables and printer settings to each.
    /// </summary>
    Task PrintBatchAsync(
        IEnumerable<string> labelPaths,
        Dictionary<string, string> variables,
        Dictionary<string, string> printerSettings,
        string printerName);

    /// <summary>
    /// Renders a set of different label templates to a single PDF at <paramref name="outputFileName"/>.
    /// </summary>
    Task PrintToPdfAsync(
        IEnumerable<string> labelPaths,
        Dictionary<string, string> variables,
        string outputFileName,
        bool appendToFile);
}
