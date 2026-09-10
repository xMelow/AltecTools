
namespace Altec.Api.Domain.Printers.Communication;

public class PrinterFile
{
    public required Stream Stream { get; set; }
    public required string FileName { get; set; }
    public required PrinterMemory Memory { get; set; }
}