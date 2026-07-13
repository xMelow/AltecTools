namespace Altec.Api.Records;

public record TsplDrawCommand(string Name, int LineNumber, IReadOnlyList<string> Arguments);