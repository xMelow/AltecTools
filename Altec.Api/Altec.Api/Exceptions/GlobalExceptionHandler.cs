using System.Net;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace Altec.Api.Exceptions;

public class GlobalExceptionHandler : IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger;

    public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
    {
        _logger = logger;
    }

    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        _logger.LogError(
            exception,
            "An unhandled exception occured during request {TraceId}: {Message}",
            httpContext.TraceIdentifier,
            exception.Message
        );

        var statusCode = HttpStatusCode.InternalServerError;
        var title = "An unexpected error occurred.";
        var detail = "We're sorry, an error occurred. Please try again later or contact support.";

        if (exception is UpstreamServiceException) {
            statusCode = HttpStatusCode.BadGateway;
            title = "External API failed";
            detail = "NiceLabel API returned an error";
        }

        var problemDetails = new ProblemDetails
        {
            Status = (int)statusCode,
            Title = title,
            Detail = detail,
            Instance = httpContext.Request.Path,
            Extensions =
            {
                {"traceId", httpContext.TraceIdentifier}
            }
        };
        
        httpContext.Response.StatusCode = (int)statusCode;
        await httpContext.Response.WriteAsJsonAsync(problemDetails, cancellationToken);
        return true;
    }
}