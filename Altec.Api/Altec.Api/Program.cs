using System.Text.Json;
using Altec.Api.Domain.Printers.Discovery;
using Altec.Api.Domain.Printers.Parsing;
using Altec.Api.Domain.Tspl;
using Altec.Api.Interface;
using Altec.Api.Services;
using Altec.Api.Services.Automation;
using Altec.Api.Services.NiceLabel;
using Altec.Api.Services.Printers;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
    });
builder.Services.AddOpenApi();

builder.Services.AddScoped<TsplParser>();
builder.Services.AddScoped<TsplRender>();
builder.Services.AddScoped<TsplValidator>();
builder.Services.AddScoped<ITsplService, TsplService>();
builder.Services.AddScoped<UsbDiscovery>();
builder.Services.AddScoped<IPrinterService, PrinterService>();
builder.Services.AddScoped<PrinterResponseParser>();

var baseUrl = builder.Configuration["NiceLabelApi:BaseUrl"] ?? throw new InvalidOperationException("Missing configuration value: 'NiceLabelApi:BaseUrl'");

builder.Services.AddHttpClient<INiceLabelClient, NiceLabelClient>(client =>
{
    client.BaseAddress = new Uri(baseUrl);
    client.DefaultRequestVersion = new Version(1, 1);
    client.DefaultVersionPolicy = HttpVersionPolicy.RequestVersionExact;
})

.ConfigurePrimaryHttpMessageHandler(() => new HttpClientHandler
{
    ServerCertificateCustomValidationCallback = 
        HttpClientHandler.DangerousAcceptAnyServerCertificateValidator
});

builder.Services.AddScoped<IAutomationService, AutomationService>();


var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/openapi/v1.json", "Altec API v1");
    });
}

app.UseHttpsRedirection();
app.MapControllers();

app.Run();