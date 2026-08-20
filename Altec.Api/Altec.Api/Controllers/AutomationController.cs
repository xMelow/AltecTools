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
    public async Task<IActionResult> SerialNumbersNewPrinters(IFormFile csvFile, [FromForm] string printerType, [FromForm] string? printerName)
    {
        if (csvFile == null || csvFile.Length == 0) return BadRequest("Csv file must be present");
        if (printerType == null) return BadRequest("Printer Type must be present");

        try
        {
            await _automationService.PrintSerialNumbers(csvFile, printerType, printerName);
            return Ok("Labels printed");
        }
        catch (Exception ex)
        {
            return BadRequest($"Error: {ex.Message}");
        }
    }

    [HttpPost("serialNumbersLabelPreview")]
    public async Task<IActionResult> SerialNumbersLabelPreview(IFormFile csvFile, [FromForm] string printerType)
    {
        if (csvFile == null || csvFile.Length == 0) return BadRequest("Excel file must be present");
        if (printerType == null) return BadRequest("Printer Type must be present");

        try
        {
            var imageList = await _automationService.PreviewSerialNumbers(csvFile, printerType);
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
        if (string.IsNullOrEmpty(orderNumber)) return BadRequest("Order number must be present");
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

    [HttpPost("sdCardPreview")]
    public async Task<IActionResult> SdCardPreview([FromForm] string orderNumber, [FromForm] string version)
    {
        if (string.IsNullOrEmpty(orderNumber)) return BadRequest("Order number must be present");

        try
        {
            var labelPreview = await _automationService.SdCardLabelPreview(orderNumber, version);
            return Ok(new { image = labelPreview });
        }
        catch (Exception ex)
        {
            return BadRequest($"Error: {ex.Message}");
        }
    }

    [HttpPost("printTestRoom")]
    public async Task<IActionResult> PrintTestRoomLabel([FromForm] string sensorType, [FromForm] int speed, [FromForm] int density, [FromForm] bool cutter, [FromForm] bool userLabel, [FromForm] string printer)
    {
        if (string.IsNullOrEmpty(sensorType)) return BadRequest("Sensor type must be present");
        // add more param checks

        try
        {
            await _automationService.PrintTestRoomLabel(sensorType, speed, density, cutter, userLabel, printer);
            return Ok("Labels printed");
        }
        catch (Exception ex)
        {
            return BadRequest($"Error: {ex.Message}");
        }
    }
}
