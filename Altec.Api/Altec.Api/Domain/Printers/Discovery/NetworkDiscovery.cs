using System.Net;
using System.Net.NetworkInformation;
using System.Net.Sockets;
using Altec.Api.Domain.Printers.Parsing;
using Altec.Api.Record.Printers;

namespace Altec.Api.Domain.Printers.Discovery;

public class NetworkDiscovery
{
    private const int DiscoveryPort = 22368;
    private static readonly TimeSpan ListenTimeout = TimeSpan.FromSeconds(3);

    private readonly NetworkDiscoveryResponseParser _parser = new();

    public async Task<IReadOnlyList<Printer>> Discover(List<string>? subnets)
    {
        var localAddresses = GetLocalIPv4Addresses(subnets);
        var printers = new List<Printer>();

        try
        {
            foreach (var address in localAddresses)
            {
                var client = new UdpClient(address.AddressFamily)
                {
                    EnableBroadcast = true
                };

                var request = BuildDiscoveryRequest();
                await client.SendAsync(request);

                var printerResponses = await ListenForResponses(client);
                printers.AddRange(printerResponses);
            }
        }
        catch (Exception ex) // what is the deeper exception of this? 
        {
            throw new Exception(ex.Message);
        }

        return printers;
    }

    private List<IPAddress> GetLocalIPv4Addresses(List<string>? subnets)
    {
        List<IPAddress> ipAddresses = new List<IPAddress>{};
        var networkInterfaceList = NetworkInterface.GetAllNetworkInterfaces().Where(ni => ni.OperationalStatus == OperationalStatus.Up && ni.NetworkInterfaceType != NetworkInterfaceType.Loopback);

        foreach (var networkInterface in networkInterfaceList)
        {
            foreach (var ip in networkInterface.GetIPProperties().UnicastAddresses)
            {
                if (ip.Address.AddressFamily == AddressFamily.InterNetwork && (subnets == null || subnets.Any(s => ip.Address.ToString().StartsWith(s + "."))))
                    ipAddresses.Add(ip.Address);
            }
        }
        return ipAddresses;
    }

    private byte[] BuildDiscoveryRequest()
    {
        return
        [
            0x00, 0x20, 0x00, 0x01, 0x00, 0x01, 0x08, 0x00,
            0x00, 0x02, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00,
            0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0xff, 0xff,
            0xff, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x00
        ];
    }

    private async Task<List<Printer>> ListenForResponses(UdpClient client)
    {
        var printers = new List<Printer>();
        using var cts = new CancellationTokenSource(ListenTimeout);

        try
        {
            while (!cts.IsCancellationRequested)
            {
                var response = await client.ReceiveAsync(cts.Token);
                var printer = _parser.Parse(response.Buffer, response.RemoteEndPoint);

                if (printer != null) 
                    printers.Add(printer);
            }
        } 
        catch (OperationCanceledException)
        {
            return printers;
        }

        return printers;
    }
}
