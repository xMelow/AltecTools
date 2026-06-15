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
        // check if connectiontype is empty --> bad request
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
    public async Task<IActionResult> SendCommand(string address, [FromBody] PrinterCommandRequest request)
    {
        // check if connectiontype is empty --> bad request
        try
        {
            var response = await _printerService.SendCommand(request.connectionType, address, request.Command);
            return Ok(new PrinterCommandResponse(response));
        } 
        catch (Exception ex)
        {
            return BadRequest($"Error sending command to printer : {ex.Message}" );
        }
    }

    [HttpPost("file/{address}")]
    public async Task<IActionResult> SendFile(string address, [FromBody] List<PrinterFile> files, [FromQuery] PrinterConnectionType connectionType)
    {   
        if (address == null) return BadRequest("Address must be present");
        
        try
        {
            await _printerService.SendFiles(connectionType, address, files);
            return Ok("Files send to printer");
        }
        catch (Exception ex)
        {
            return BadRequest($"Error sending files to the printer: {ex.Message}");
        }
        finally
        {
            foreach (var file in files)
                await file.Stream.DisposeAsync();
        }
    }
}