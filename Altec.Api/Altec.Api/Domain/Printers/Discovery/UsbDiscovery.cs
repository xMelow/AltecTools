using Altec.Api.Record.Printers;
using System.Runtime.InteropServices;
using Altec.Api.Domain.Printers.Communication;

namespace Altec.Api.Domain.Printers.Discovery;

public class UsbDiscovery
{
    [DllImport("setupapi.dll", SetLastError = true)]
    private static extern IntPtr SetupDiGetClassDevs(
        ref Guid classGuid,
        IntPtr enumerator,
        IntPtr hwndParent,
        uint flags
    );

    [DllImport("setupapi.dll", SetLastError = true)]
    private static extern bool SetupDiEnumDeviceInterfaces(
        IntPtr hDevInfo,
        IntPtr devInfo,
        ref Guid interfaceClassGuid,
        uint memberIndex,
        ref SP_DEVICE_INTERFACE_DATA deviceInterfaceData
    );

    [DllImport("setupapi.dll", CharSet = CharSet.Auto, SetLastError = true)]
    private static extern bool SetupDiGetDeviceInterfaceDetail(
        IntPtr hDevInfo,
        ref SP_DEVICE_INTERFACE_DATA deviceInterfaceData,
        IntPtr deviceInterfaceDetailData,
        uint deviceInterfaceDetailDataSize,
        out uint requiredSize,
        IntPtr deviceInfoData
    );

    [DllImport("setupapi.dll", SetLastError = true)]
    private static extern bool SetupDiDestroyDeviceInfoList(IntPtr hDevInfo);

    [StructLayout(LayoutKind.Sequential)]
    private struct SP_DEVICE_INTERFACE_DATA
    {
        public uint cbSize;
        public Guid InterfaceClassGuid;
        public uint Flags;
        public IntPtr Reserved;
    }

    private const uint DIGCF_PRESENT = 0x02;
    private const uint DIGCF_DEVICEINTERFACE = 0x10;
    private static readonly Guid UsbPrintGuid = new Guid("{28D78FAD-5A12-11D1-AE5B-0000F803A8C2}");
    private const string AltecVendorId = "vid_1203";

    public IReadOnlyList<Printer> Discover()
    {
        if (!System.OperatingSystem.IsWindows())
        {
            throw new PlatformNotSupportedException("USB discovery is only supported on Windows.");
        }

        var printers = new List<Printer>();
        var usbPrinterFilter = UsbPrintGuid;    
        var usbPrinterList = SetupDiGetClassDevs(ref usbPrinterFilter, IntPtr.Zero, IntPtr.Zero, DIGCF_PRESENT | DIGCF_DEVICEINTERFACE);

        if (usbPrinterList == new IntPtr(-1))
            throw new Exception("No printers connected via USB");

        try
        {
            var interfaceData = new SP_DEVICE_INTERFACE_DATA { cbSize = (uint)Marshal.SizeOf<SP_DEVICE_INTERFACE_DATA>() };
            uint index = 0;

            while (SetupDiEnumDeviceInterfaces(usbPrinterList, IntPtr.Zero, ref usbPrinterFilter, index++, ref interfaceData))
            {
                SetupDiGetDeviceInterfaceDetail(usbPrinterList, ref interfaceData, IntPtr.Zero, 0, out uint requiredSize, IntPtr.Zero);
                var detailBuffer = Marshal.AllocHGlobal((int)requiredSize);

                try
                {
                    Marshal.WriteInt32(detailBuffer, IntPtr.Size == 8 ? 8 : 6);
                    SetupDiGetDeviceInterfaceDetail(usbPrinterList, ref interfaceData, detailBuffer, requiredSize, out _, IntPtr.Zero);
                    var devicePath = Marshal.PtrToStringAuto(detailBuffer + 4);

                    if (devicePath != null && devicePath.Contains(AltecVendorId, StringComparison.OrdinalIgnoreCase))
                        printers.Add(new Printer("Altec USB Printer", devicePath, "", PrinterConnectionType.Usb));
                }
                finally
                {
                    Marshal.FreeHGlobal(detailBuffer);
                }
            }
        }
        finally
        {
            SetupDiDestroyDeviceInfoList(usbPrinterList);
        }

        return printers;
    }
}
