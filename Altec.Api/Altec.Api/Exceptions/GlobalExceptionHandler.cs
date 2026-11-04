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

        var problemDetails = new ProblemDetails
        {
            Status = (int) HttpStatusCode.InternalServerError,
            Title = "An unexpected error occurred.",
            Detail = "We're sorry, an error occurred. Please try again later or contact support.",
            Instance = httpContext.Request.Path,
        };
        problemDetails.Extensions["traceId"] = httpContext.TraceIdentifier;

        switch (exception)
        {
            case UpstreamServiceException:
                problemDetails.Status = (int) HttpStatusCode.BadGateway;
                problemDetails.Title = "External API failed";
                problemDetails.Detail = "NiceLabel API returned an error";
                break;
            case TsplRenderException tsplRender:
                problemDetails.Status = (int) HttpStatusCode.UnprocessableContent;
                problemDetails.Title = "Unable to parse TSPL";
                problemDetails.Detail = tsplRender.Message;
                problemDetails.Extensions["lineNumber"] = tsplRender.LineNumber;
                break;
        }
        
        httpContext.Response.StatusCode = (int) problemDetails.Status;
        await httpContext.Response.WriteAsJsonAsync(problemDetails, cancellationToken);
        return true;
    }
}