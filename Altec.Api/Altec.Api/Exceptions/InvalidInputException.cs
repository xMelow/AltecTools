namespace Altec.Api.Exceptions;

public class InvalidInputException : Exception
{
    public InvalidInputException(string message, Exception innerException)
        : base($"Invalid Input: {message}", innerException)
    {}

    public InvalidInputException(string message)
        : base($"Invalid Input: {message}")
    {}
}
