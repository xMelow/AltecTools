using Altec.Api.Domain.Printers.Communication;

namespace Altec.Api.Record.Printers;

public record Printer(string Name, string Address, string Model, PrinterConnectionType ConnectionType);
