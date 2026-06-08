
namespace Altec.Api.Domain.Printers.Communication;

public class PrinterFile
{
    public Stream Stream { get; set; }
    public string FileName { get; set; }
    public PrinterMemory Memory { get; set; }
}