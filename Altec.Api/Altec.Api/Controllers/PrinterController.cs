using System.IO;
using System.Net;
using System.Net.Sockets;
using Altec.Api.Domain.Printers.Communication;
using Altec.Api.Domain.Printers.Connections;
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
        try
        {
            var info = await _printerService.GetPrinterInfo(connectionType, address);
            return Ok(info);
        }
         catch (Exception ex)
        {
            return BadRequest($"Error sending command to printer : {ex.Message}");
        }
    }

    [HttpPost("command/{address}")]
    public async Task<IActionResult> SendCommand(string address, [FromBody] PrinterCommandRequest request, [FromQuery] PrinterConnectionType connectionType)
    {
        try
        {
            var response = await _printerService.SendCommand(connectionType, address, request.Command);
            return Ok(new PrinterCommandResponse(response));
        } 
        catch (Exception ex)
        {
            return BadRequest($"Error sending command to printer : {ex.Message}" );
        }
    }

    [HttpPost("file/{address}")]
    public async Task<IActionResult> SendFile(string address, [FromForm] List<IFormFile> files, [FromForm] List<string> fileNames, [FromForm] List<string> memories, [FromQuery] PrinterConnectionType connectionType)
    {   
        if (address == null) return BadRequest("Address must be present");
        
        try
        {
            var fileBundle = new List<PrinterFile>();

            for (int i = 0; i < files.Count; i++)
            {
                fileBundle.Add(new PrinterFile{ FileName = fileNames[i], Memory = Enum.Parse<PrinterMemory>(memories[i]), Stream = files[i].OpenReadStream()});
            }

            await _printerService.SendFiles(connectionType, address, fileBundle);
            return Ok("Files send to printer");
        }
        catch (Exception ex)
        {
            return BadRequest($"Error sending files to the printer: {ex.Message}");
        }
    }
}