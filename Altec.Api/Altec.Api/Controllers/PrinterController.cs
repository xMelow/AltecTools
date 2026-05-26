using System.IO;
using System.Net.Sockets;
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
    public async Task<IActionResult> Discover([FromQuery] List<string> subnets)
    {
        var printers = await _printerService.GetPrinters(subnets);
        return Ok(new PrinterResponse(printers));
    }
    
    [HttpGet("{ipAddress}/settings")]
    public async Task<IActionResult> GetPrinterSettings(string ipAddress)
    {
        try
        {
            var info = await _printerService.GetPrinterInfo(ipAddress);
            Console.WriteLine(info);
            return Ok(info);
        }
        catch (OperationCanceledException)
        {
            return StatusCode(503, "Printer is unreachable");
        }
        catch (SocketException)
        {
            return StatusCode(503, "Printer is unreachable");
        }
        catch (IOException)
        {
            return StatusCode(503, "Printer is unreachable");
        }
    }

    [HttpPost("{ipAddress}/command")]
    public async Task<IActionResult> SendCommand(string ipAddress, [FromBody] PrinterCommandRequest request)
    {
        try
        {
            var response = await _printerService.SendCommand(ipAddress, request.Command);
            return Ok(new PrinterCommandResponse(response));
        } 
        catch (Exception ex)
        {
            return BadRequest($"Error sending command to printer : {ex.Message}" );
        }
    }

    [HttpPost("{ipAddress}/file")]
    public async Task<IActionResult> SendFile(string ipAddress)
    {
        var fileNames = Request.Form["fileNames"].ToArray();
        var memories = Request.Form["memories"].ToArray();

        var entries = Request.Form.Files
            .Select((file, i) => (
                Stream: file.OpenReadStream(),
                FileName: i < fileNames.Length ? fileNames[i] : file.FileName,
                Memory: i < memories.Length ? memories[i] : string.Empty
            ))
            .ToList();

        try
        {
            var response = await _printerService.SendFiles(ipAddress, entries.Select(e => (e.Stream, e.FileName, e.Memory)));
            return Ok(new PrinterCommandResponse(response));
        }
        finally
        {
            foreach (var entry in entries)
                await entry.Stream.DisposeAsync();
        }
    }
}