using Altec.Api.Domain.Printers.Communication;

namespace Altec.Api.Record.Printers;

public record PrinterCommandRequest(PrinterConnectionType connectionType, string Command);
