using Altec.Api.Domain.Printers.Communication;
using Altec.Api.Record.Printers;
using Altec.Api.Services.Printers;
using Microsoft.AspNetCore.Mvc;

namespace Altec.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PrinterController : ControllerBase
{
    private readonly IPrinterService _printerService;

    public PrinterController(IPrinterService printerService)
    {
        _printerService = printerService; 
    }

    [HttpGet("discover")]
    public async Task<IActionResult> Discover([FromQuery] PrinterConnectionType connectionType, [FromQuery] List<string>? subnets)
    {
        var printers = await _printerService.GetPrinters(connectionType, subnets);
        return Ok(new PrinterResponse(printers));
    }
    
    [HttpGet("getPrinterInfo/{address}")]
    public async Task<IActionResult> GetPrinterInfo(string address, [FromQuery] PrinterConnectionType connectionType)
    {
        var info = await _printerService.GetPrinterInfo(connectionType, address);
        return Ok(info);
    }

    [HttpPost("command/{address}")]
    public async Task<IActionResult> SendCommand(string address, [FromBody] PrinterCommandRequest request, [FromQuery] PrinterConnectionType connectionType)
    {
        var response = await _printerService.SendCommand(connectionType, address, request.Command);
        return Ok(new PrinterCommandResponse(response));
    }

    [HttpPost("file/{address}")]
    public async Task<IActionResult> SendFile(string address, [FromForm] List<IFormFile> files, [FromForm] List<string> fileNames, [FromForm] List<string> memories, [FromQuery] PrinterConnectionType connectionType)
    {   
        if (address == null) return BadRequest("Address must be present");
    
        var fileBundle = new List<PrinterFile>();

        for (int i = 0; i < files.Count; i++)
        {
            fileBundle.Add(new PrinterFile{ FileName = fileNames[i], Memory = Enum.Parse<PrinterMemory>(memories[i]), Stream = files[i].OpenReadStream()});
        }

        await _printerService.SendFiles(connectionType, address, fileBundle);
        return Ok("Files send to printer");
    }
}
