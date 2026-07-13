namespace Altec.Api.Domain.Tspl;

class TsplRenderException : Exception
{
    public int LineNumber { get; }

    public TsplRenderException(int lineNumber, Exception innerException)
        : base($"Error on line {lineNumber}: {innerException.Message}", innerException)
    {
        LineNumber = lineNumber;
    }

    public TsplRenderException(int lineNumber, string message)
        : base($"Error on line {lineNumber}: {message}")
    {
        LineNumber = lineNumber;
    }
}
