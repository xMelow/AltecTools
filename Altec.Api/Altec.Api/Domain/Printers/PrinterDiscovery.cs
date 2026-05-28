using System.Net;
using System.Net.Sockets;
using System.Text;
using Altec.Api.Record.Printers;

namespace Altec.Api.Domain.Printers;

public class PrinterDiscovery
{
    private const int PrinterPort = 9100;
    private readonly PrinterResponseParser _parser = new PrinterResponseParser();
    
    public async Task<IReadOnlyList<Printer>> Discover(List<string> subnets)
    {
        List<Printer> printers = new List<Printer>();
        foreach (var subnet in subnets)
        {
            var ipAddresses = GetSubnetIpAddresses(subnet);
            var foundIps = await ScanForOpenPorts(ipAddresses);
            var foundPrinters = await GetPrinterDetails(foundIps);
            printers.AddRange(foundPrinters);
        }
        return printers;
    }

    private IReadOnlyList<IPAddress> GetSubnetIpAddresses(string subnet)
    {
        var subnetData = ParseSubnet(subnet);
        var bytes = subnetData.baseIp.GetAddressBytes();
        var startIp = (bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[3];
        var numberOfAddresses = (int)Math.Pow(2, 32 - subnetData.prefixLength);
        List<IPAddress> ipAddresses = new List<IPAddress>();
        for (int i = startIp; i < numberOfAddresses + startIp; i++)
        {
            var ipBytes = new byte[]
            {
                (byte)(i >> 24),
                (byte)(i >> 16),
                (byte)(i >> 8),
                (byte)i
            };
            var ipAddress = new IPAddress(ipBytes);
            if (IsValidHostAddress(ipAddress))
                ipAddresses.Add(ipAddress);
        }
        return ipAddresses;
    }

    private async Task<IEnumerable<IPAddress>> ScanForOpenPorts(IReadOnlyList<IPAddress> ipAddresses)
    {
        var tasks = ipAddresses.Select(ip => IsPortOpen(ip, PrinterPort, 200));
        var results = await Task.WhenAll(tasks);
        var foundIps = ipAddresses
            .Zip(results, (ip, isOpen) => (ip, isOpen))
            .Where(x => x.isOpen)
            .Select(x => x.ip);
        return foundIps;
    }

    private async Task<List<Printer?>> GetPrinterDetails(IEnumerable<IPAddress> foundIps)
    {
        var printerTask = foundIps.Select(async ip =>
            {
                try
                {
                    if (!await IsTscPrinter(ip))
                        return null;
                    var printerInfo = await GetPrinterInfo(ip);
                    return new Printer(printerInfo.printerDnsName, ip.ToString(), printerInfo.printerModelName, PrinterPort);
                }
                catch
                {
                    return null;
                }
            });
        var foundPrinters = await Task.WhenAll(printerTask);
        return foundPrinters.Where(p => p != null && p.PrinterModel != "Unknown").ToList();
    }

    private async Task<bool> IsTscPrinter(IPAddress ip)
    {
        try
        {
            using var http = new HttpClient { Timeout = TimeSpan.FromMilliseconds(500) };
            var response = await http.GetStringAsync($"http://{ip}/");
            // Got a web response — only TSC if it says so, otherwise it's a non-TSC printer
            return response.Contains("TSC", StringComparison.OrdinalIgnoreCase);
        }
        catch (Exception ex) when (ex is HttpRequestException or TaskCanceledException)
        {
            // No web interface — fall back to ~!T: TSC printers reply over TCP, A4 printers don't
            return await HasTscTcpResponse(ip);
        }
    }

    private async Task<bool> HasTscTcpResponse(IPAddress ip)
    {
        try
        {
            using var client = new TcpClient();
            await client.ConnectAsync(ip, PrinterPort);
            var stream = client.GetStream();
            await stream.WriteAsync(Encoding.ASCII.GetBytes("~!T\r\n"));
            await Task.Delay(200);

            var buffer = new byte[1024];
            var readTask = stream.ReadAsync(buffer, 0, buffer.Length);
            var completed = await Task.WhenAny(readTask, Task.Delay(400));
            if (completed != readTask) return false;

            var bytesRead = await readTask;
            return bytesRead > 0;
        }
        catch
        {
            return false;
        }
    }

    private (IPAddress baseIp, int prefixLength) ParseSubnet(string subnet)
    {
        var parts = subnet.Split("/");
        return (IPAddress.Parse(parts[0]), Convert.ToInt32(parts[1]));
    }

    private bool IsValidHostAddress(IPAddress ip)
    {
        var bytes = ip.GetAddressBytes();
        return bytes[3] != 0 && bytes[3] != 255;
    }

    private async Task<bool> IsPortOpen(IPAddress ip, int port, int timeoutMs)
    {
        try
        {
            using var client = new TcpClient();
            var connectTask = client.ConnectAsync(ip, port);
            var timeoutTask = Task.Delay(timeoutMs);
            await Task.WhenAny(connectTask, timeoutTask);
            return client.Connected;
        }
        catch
        {
            return false;
        }
    }

    private async Task<(string printerDnsName, string printerModelName)> GetPrinterInfo(IPAddress ip)
    {
        var commandTask = SendPrinterCommand(ip, string.Join("\r\n",
            "OUT \"NAME=\";GETSETTING$(\"CONFIG\",\"NET\",\"NAME\")",
            "OUT \"MODEL=\";GETSETTING$(\"SYSTEM\",\"INFORMATION\",\"MODEL\")",
            "END"
        ));
        var timeoutTask = Task.Delay(1500);
        var completed = await Task.WhenAny(commandTask, timeoutTask);
        if (completed != commandTask)
            return ("Not found", "Unknown");

        var response = await commandTask;
        var settings = response
            .Split('\n', StringSplitOptions.RemoveEmptyEntries)
            .Select(l => l.Trim())
            .Where(l => l.Contains('='))
            .Select(l => l.Split('=', 2))
            .ToDictionary(parts => parts[0], parts => parts[1].Trim(), StringComparer.OrdinalIgnoreCase);

        return (settings.GetValueOrDefault("NAME", "Not found"), settings.GetValueOrDefault("MODEL", "Unknown"));
    }

    public async Task<PrinterInfo> GetPrinterSettings(IPAddress ip)
    {
        var program = string.Join("\r\n",
                "OUT \"MODEL=\";GETSETTING$(\"SYSTEM\",\"INFORMATION\",\"MODEL\")",
                "OUT \"SERIAL=\";GETSETTING$(\"SYSTEM\",\"INFORMATION\",\"SERIAL\")",
                "OUT \"VERSION=\";GETSETTING$(\"SYSTEM\",\"INFORMATION\",\"VERSION\")",
                "OUT \"CHECK SUM=\";GETSETTING$(\"SYSTEM\",\"INFORMATION\",\"CHECKSUM\")",
                "OUT \"DPI=\";GETSETTING$(\"SYSTEM\",\"INFORMATION\",\"DPI\")",
                "OUT \"PRINTER STATUS=\";GETSETTING$(\"SYSTEM\",\"INFORMATION\",\"PRINTER STATUS\")",
                "OUT \"MILAGE=\";GETSETTING$(\"SYSTEM\",\"RECORD\",\"MILAGE\")",
                "OUT \"LABEL COUNTER=\";GETSETTING$(\"SYSTEM\",\"RECORD\",\"LABEL COUNTER\")",
                "OUT \"CUT COUNTER=\";GETSETTING$(\"SYSTEM\",\"RECORD\",\"CUT COUNTER\")",
                "OUT \"MAC ADDRESS NET=\";GETSETTING$(\"CONFIG\",\"NET\",\"MAC ADDRESS\")",
                "OUT \"IP ADDRESS NET=\";GETSETTING$(\"CONFIG\",\"NET\",\"IP ADDRESS\")",
                "OUT \"NAME=\";GETSETTING$(\"CONFIG\",\"NET\",\"NAME\")",
                "OUT \"SENSOR TYPE=\";GETSETTING$(\"CONFIG\",\"SENSOR\",\"SENSOR TYPE\")",
                "OUT \"HEAD OPEN SENSOR=\";GETSETTING$(\"CONFIG\",\"SENSOR\",\"CARRIAGE\")",
                "OUT \"GAP SIZE=\";GETSETTING$(\"CONFIG\",\"TSPL\",\"GAP SIZE\")",
                "OUT \"GAP OFFSET=\";GETSETTING$(\"CONFIG\",\"TSPL\",\"GAP OFFSET\")",
                "OUT \"BLINE SIZE=\";GETSETTING$(\"CONFIG\",\"TSPL\",\"BLINE SIZE\")",
                "OUT \"POST PRINT=\";GETSETTING$(\"CONFIG\",\"TSPL\",\"PRINT MODE\")",
                "OUT \"SPEED=\";GETSETTING$(\"CONFIG\",\"TSPL\",\"SPEED\")",
                "OUT \"DENSITY=\";GETSETTING$(\"CONFIG\",\"TSPL\",\"DENSITY\")", 
                "OUT \"PAPER SIZE=\";GETSETTING$(\"CONFIG\",\"TSPL\",\"PAPER SIZE\")",
                "OUT \"PAPER WIDTH=\";GETSETTING$(\"CONFIG\",\"TSPL\",\"PAPER WIDTH\")",
                "OUT \"DIRECTION=\";GETSETTING$(\"CONFIG\",\"TSPL\",\"DIRECTION\")",
                "OUT \"MIRROR=\";GETSETTING$(\"CONFIG\",\"TSPL\",\"MIRROR\")",
                "OUT \"RIBBON=\";GETSETTING$(\"CONFIG\",\"TSPL\",\"RIBBON\")",
                "OUT \"OFFSET=\";GETSETTING$(\"CONFIG\",\"TSPL\",\"OFFSET\")",
                "OUT \"SHIFT X=\";GETSETTING$(\"CONFIG\",\"TSPL\",\"SHIFT X\")",
                "OUT \"SHIFT Y=\";GETSETTING$(\"CONFIG\",\"TSPL\",\"SHIFT Y\")",
                "OUT \"REFERENCE X=\";GETSETTING$(\"CONFIG\",\"TSPL\",\"REFERENCE X\")",
                "OUT \"REFERENCE Y=\";GETSETTING$(\"CONFIG\",\"TSPL\",\"REFERENCE Y\")",
                "OUT \"COUNTRY CODE=\";GETSETTING$(\"CONFIG\",\"TSPL\",\"COUNTRY CODE\")",
                "OUT \"CODEPAGE=\";GETSETTING$(\"CONFIG\",\"TSPL\",\"CODEPAGE\")",
                "END"
        );
        
        var response = await SendPrinterCommand(ip, program);  
        return _parser.ParseSettings(response);
    }

    public async Task<string> SendPrinterCommand(IPAddress ip, string command)
    {
        using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(5));
        using var client = new TcpClient();
        await client.ConnectAsync(ip, 9100, cts.Token);

        using var stream = client.GetStream();

        var data = Encoding.ASCII.GetBytes(command + "\r\n");
        await stream.WriteAsync(data, cts.Token);

        var buffer = new byte[4096];
        var readTask = stream.ReadAsync(buffer, cts.Token).AsTask();
        var timeoutTask = Task.Delay(TimeSpan.FromSeconds(1), cts.Token);

        if (await Task.WhenAny(readTask, timeoutTask) != readTask)
            return "Command sent successfully";

        var bytesRead = await readTask;
        return Encoding.ASCII.GetString(buffer, 0, bytesRead);
    }

    public async Task<string> SendPrinterFiles(IPAddress ip, IEnumerable<(Stream stream, string fileName, string memory)> files)
    {
        using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(30));
        using var client = new TcpClient();
        await client.ConnectAsync(ip, PrinterPort, cts.Token);
        using var tcpStream = client.GetStream();

        foreach (var (stream, fileName, memory) in files)
        {
            var memPrefix = memory switch { "F" => "F,", "E" => "E,", _ => "" };
            var ext = Path.GetExtension(fileName).ToUpperInvariant();

            if (ext == ".BAS")
            {
                var header = Encoding.ASCII.GetBytes($"DOWNLOAD {memPrefix}\"{fileName}\"\r\n");
                await tcpStream.WriteAsync(header, cts.Token);
                await stream.CopyToAsync(tcpStream, cts.Token);
                await tcpStream.WriteAsync(Encoding.ASCII.GetBytes("\r\nEOP\r\n"), cts.Token);
            }
            else
            {
                using var ms = new MemoryStream();
                await stream.CopyToAsync(ms, cts.Token);
                var fileBytes = ms.ToArray();
                var header = Encoding.ASCII.GetBytes($"DOWNLOAD {memPrefix}\"{fileName}\",{fileBytes.Length},");
                await tcpStream.WriteAsync(header, cts.Token);
                await tcpStream.WriteAsync(fileBytes, cts.Token);
                await tcpStream.WriteAsync(Encoding.ASCII.GetBytes("\r\n"), cts.Token);
            }
        }

        await tcpStream.FlushAsync(cts.Token);
        return "File sent successfully";
    }
}
