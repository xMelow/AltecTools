using System.Buffers;
using System.Net;
using System.Net.NetworkInformation;
using System.Net.Sockets;
using Altec.Api.Domain.Printers.Communication;
using Altec.Api.Domain.Printers.Parsing;
using Altec.Api.Record.Printers;
using Microsoft.OpenApi.Extensions;

namespace Altec.Api.Domain.Printers.Discovery;

public class NetworkDiscovery
{
    private const int DiscoveryPort = 22368;
    private static readonly TimeSpan ListenTimeout = TimeSpan.FromSeconds(3);

    private readonly NetworkDiscoveryResponseParser _parser = new();

    public async Task<IReadOnlyList<Printer>> Discover(List<string>? subnets)
    {
        // TODO: Get the list of local IPv4 addresses to broadcast from.
        // - If `subnets` is null/empty, use every active IPv4 interface on the
        //   machine (NetworkInterface.GetAllNetworkInterfaces(), filter to
        //   OperationalStatus.Up + NetworkInterfaceType != Loopback).
        // - If `subnets` is given, only use interfaces whose address falls in
        //   one of those subnets.
        var localAddresses = GetLocalIPv4Addresses(subnets);

        var printers = new List<Printer>();

        // TODO: For each local address:
        //   1. Create a UdpClient bound to that local address (so the
        //      broadcast goes out the correct NIC, not whatever the OS
        //      default route picks).
        //   2. Enable EnableBroadcast on the socket.
        //   3. Send BuildDiscoveryRequest() to IPAddress.Broadcast (255.255.255.255), DiscoveryPort.
        //   4. Call ListenForResponses(client) and merge results into `printers`
        //      (watch out for duplicates if a printer answers on more than
        //      one interface).
        //
        // Remember: UsbDiscovery wraps device failures in try/catch so one
        // bad device doesn't kill the whole scan. Same idea applies per
        // interface here — one NIC failing to bind shouldn't abort the rest.

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
                var ipAddressFamily = ip.Address.AddressFamily;

                if (ipAddressFamily == AddressFamily.InterNetwork && (subnets == null || subnets.Any(s => ip.Address.ToString().StartsWith(s + "."))))
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

        // TODO: Loop calling client.ReceiveAsync() until ListenTimeout elapses.
        // - A single ReceiveAsync() call can hang forever if no more replies
        //   come in, so you need a way to cancel it after the timeout
        //   (CancellationTokenSource + ReceiveAsync(token), or Task.WhenAny
        //   with a Task.Delay).
        // - For each datagram received: result.RemoteEndPoint.Address gives
        //   you the printer's IP directly (no need to parse it out of the
        //   payload). Pass result.Buffer to _parser.Parse(...) to get the
        //   rest (name, model, MAC).
        // - Catch the timeout/cancellation and just return what you have —
        //   not every printer on the subnet needs to reply.

        return printers;
    }
}
