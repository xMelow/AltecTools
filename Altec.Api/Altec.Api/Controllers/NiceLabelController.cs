using Altec.Api.Services.NiceLabel;
using Microsoft.AspNetCore.Mvc;

namespace Altec.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NiceLabelController : ControllerBase
{
    private readonly INiceLabelService _niceLabelService;

    public NiceLabelController(INiceLabelService niceLabelClient)
    {
        _niceLabelService = niceLabelClient;
    }

    [HttpPost("variables")]
    public async Task<IActionResult> Variables(IFormFile label)
    {
        if (label == null || label.Length == 0) return BadRequest("Label can't be empty");

        var variables = await _niceLabelService.GetVariables(label);
        return Ok(variables);
    }
    
    [HttpPost("print")]
    public async Task<IActionResult> Print(IFormFile label, [FromForm] int quantity, [FromForm] string? printerName)
    {
        if (label == null || label.Length == 0) return BadRequest("Label file needs to be present");
        if (quantity == 0) return BadRequest("Quantity must be higher then zero");
        
        await _niceLabelService.PrintLabel(label, quantity, printerName);
        return Ok("Printing label...");
    }

    [HttpPost("labelPreview")]
    public async Task<IActionResult> LabelPreview(IFormFile label, [FromForm] int width, [FromForm] int height)
    {
        if (width <= 0 || height <= 0) return BadRequest("Width and height must be greater then 0");

        var previewBytes = await _niceLabelService.GetLabelPreview(label, width, height);
        return Ok(previewBytes);
    }

    [HttpGet("printers")]
    public async Task<IActionResult> GetPrinters()
    {
        var printers = await _niceLabelService.GetPrinters();
        return Ok(printers);
    }

    [HttpPost("labelDetails")]
    public async Task<IActionResult> GetLabelDetails(IFormFile label)
    {
        if (label == null || label.Length == 0) return BadRequest("Label file needs to be present");

        var data = await _niceLabelService.GetLabelDetails(label);
        return Ok(data);
    }
}
