using System.Net;

namespace Altec.Api.Exceptions;

public class UpstreamServiceException : Exception
{
    public HttpStatusCode StatusCode { get; }
    public string Endpoint { get; }
    public string ResponseBody { get; }

    public UpstreamServiceException(HttpStatusCode statusCode, string endpoint, string responseBody)
        : base($"endpoint: {endpoint} failed with status code: {statusCode} response body: {responseBody}")
    {
        StatusCode = statusCode;
        Endpoint = endpoint;
        ResponseBody = responseBody;
    }
}
