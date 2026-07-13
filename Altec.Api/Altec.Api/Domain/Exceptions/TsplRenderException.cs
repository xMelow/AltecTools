

class TsplRenderException : Exception
{
    public int LineNumber { get; }

    public TsplRenderException(int lineNumber, Exception innerException)
        : base($"Error on line {lineNumber}: {innerException.Message}", innerException)
    {
        LineNumber = lineNumber;
    }
}