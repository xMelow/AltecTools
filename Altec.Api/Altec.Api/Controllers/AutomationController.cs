using Altec.Api.Services.Automation;
using DocumentFormat.OpenXml.Drawing.Charts;
using Microsoft.AspNetCore.Mvc;

namespace Altec.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AutomationController : ControllerBase
{
    private readonly IAutomationService _automationService;

    public AutomationController(IAutomationService automationService)
    {
        _automationService = automationService;
    }

    [HttpPost("serialNumbersNewPrinters")]
    public async Task<IActionResult> SerialNumbersNewPrinters(IFormFile excelFile, [FromForm] string printerType, [FromForm] string? printerName)
    {
        if (excelFile == null || excelFile.Length == 0) return BadRequest("Excel file must be present");
        if (printerType == null) return BadRequest("Printer Type must be present");

        try
        {
            await _automationService.PrintSerialNumbers(excelFile, printerType, printerName);
            return Ok("Labels printed");
        }
        catch (Exception ex)
        {
            return BadRequest($"Error: {ex.Message}");
        }
    }

    [HttpPost("serialNumbersLabelPreview")]
    public async Task<IActionResult> SerialNumbersLabelPreview(IFormFile excelFile, [FromForm] string printerType)
    {
        if (excelFile == null || excelFile.Length == 0) return BadRequest("Excel file must be present");
        if (printerType == null) return BadRequest("Printer Type must be present");

        try
        {
            var imageList = await _automationService.PreviewSerialNumbers(excelFile, printerType);
            return Ok(imageList);
        }
        catch (Exception ex)
        {
            return BadRequest($"Error: {ex.Message}");
        }
    }

     [HttpPost("sdCard")]
    public async Task<IActionResult> SdCard([FromForm] string orderNumber, [FromForm] string version, [FromForm] int amount)
    {
        if (orderNumber == null || orderNumber.Length == 0) return BadRequest("Order number must be present");
        if (amount == 0) return BadRequest("Amount can't be zero");

        try
        {
            await _automationService.PrintSdCardLabel(orderNumber, version, amount);
            return Ok("Labels printed");
        }
        catch (Exception ex)
        {
            return BadRequest($"Error: {ex.Message}");
        }
    }
}
