namespace Altec.Api.Exceptions;

public class InvalidInputException : Exception
{
    public InvalidInputException(int line, Exception innerException)
        : base($"Invalid Input: {innerException.Message} on line: {line}", innerException)
    {}

    public InvalidInputException(int line)
        : base($"Invalid Input: unable to parse line {line}")
    {}

    public InvalidInputException(string message)
        : base($"Invalid Input: {message}")
    {}
}
