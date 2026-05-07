using Altec.Api.Services.Automation;
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
            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest($"Error: {ex.Message}");
        }
    }

    [HttpPost("serialNumbersLabelPreview")]
    public async Task<IActionResult> SerialNumbersLabelPreview(IFormFile excelFile, [FromForm] string printerType, [FromForm] int width, [FromForm] int height)
    {
        if (excelFile == null || excelFile.Length == 0) return BadRequest("Excel file must be present");
        if (printerType == null) return BadRequest("Printer Type must be present");
        if (width <= 0 || height <= 0) return BadRequest("Width and height must be greater then 0");

        try
        {
            var previewBytes = await _automationService.PreviewSerialNumbers(excelFile, printerType, width, height);
            return File(previewBytes, "image/png");
        }
        catch (Exception ex)
        {
            return BadRequest($"Error: {ex.Message}");
        }
    }
}
