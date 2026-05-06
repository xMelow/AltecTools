import { CommandGroup } from "../types/printerTerminal"

export const TSPL_COMMAND_GROUPS: CommandGroup[] = [
    {
        label: "Status & Diagnostics",
        commands: [
            { label: "Self Test", command: "SELFTEST" },
        ],
    },
    {
        label: "Paper Control",
        commands: [
            { label: "Feed", command: "FEED" },
            { label: "Form Feed", command: "FORMFEED" },
            { label: "Home", command: "HOME" },
            { label: "End of Page", command: "EOP" },
        ],
    },
    {
        label: "Print Buffer",
        commands: [
            { label: "Clear Buffer", command: "CLS" },
            { label: "Print 1 Copy", command: "PRINT 1" },
        ],
    },
    {
        label: "Calibration",
        commands: [
            { label: "Auto Detect", command: "AUTODETECT" },
            { label: "Gap Detect", command: "GAPDETECT" },
            { label: "Black Mark Detect", command: "BLINEDETECT" },
        ],
    },
    {
        label: "Tear / Peel / Cutter",
        commands: [
            { label: "Tear On", command: "SET TEAR ON" },
            { label: "Tear Off", command: "SET TEAR OFF" },
            { label: "Peel On", command: "SET PEEL ON" },
            { label: "Peel Off", command: "SET PEEL OFF" },
            { label: "Cutter On", command: "SET CUTTER ON" },
            { label: "Cutter Off", command: "SET CUTTER OFF" },
        ],
    },
    {
        label: "Keys",
        commands: [
            { label: "Key4 On", command: "SET KEY4 ON" },
            { label: "Key4 Off", command: "SET KEY4 OFF" },
            { label: "Key5 On", command: "SET KEY5 ON" },
            { label: "Key5 Off", command: "SET KEY5 OFF" },
        ],
    },
    {
        label: "System",
        commands: [
            { label: "Reprint On", command: "SET REPRINT ON" },
            { label: "Reprint Off", command: "SET REPRINT OFF" },
            { label: "Reset", command: "RESET" },
        ],
    },
]

export const DIAGTOOL_COMMAND_GROUPS: CommandGroup[] = [
    {
        label: "Calibration",
        commands: [
            { label: "Auto Detect", command: "AUTODETECT" },
            { label: "Gap Sensor Detect", command: "GAPDETECT" },
            { label: "Black Mark Detect", command: "BLINEDETECT" },
            { label: "Gap Sensor Auto", command: "SET GAP AUTO" },
        ],
    },
    {
        label: "Self Test Pages",
        commands: [
            { label: "Full Self Test", command: "SELFTEST" },
            { label: "Print Head Pattern", command: "SELFTEST PATTERN" },
            { label: "System Info", command: "SELFTEST SYSTEM" },
            { label: "Ethernet Info", command: "SELFTEST ETHERNET" },
            { label: "WiFi Info", command: "SELFTEST WLAN" },
            { label: "RS232 Info", command: "SELFTEST RS232" },
            { label: "Bluetooth Info", command: "SELFTEST BT" },
        ],
    },
    {
        label: "Paper Control",
        commands: [
            { label: "Feed Label", command: "FEED 25" },
            { label: "Form Feed", command: "FORMFEED" },
            { label: "Home", command: "HOME" },
            { label: "Cut", command: "CUT" },
        ],
    },
    {
        label: "Status",
        commands: [
            { label: "Quick Status", command: "\x1B!?" },
            { label: "Full Status", command: "\x1B!S" },
            { label: "Free Memory", command: "~!A" },
            { label: "Mileage", command: "~!@" },
            { label: "Files List", command: "~!F" },
            { label: "Model Info", command: "~!T" },
            { label: "Code Page Info", command: "~!I" },
        ],
    },
    {
        label: "Network",
        commands: [
            { label: "Ethernet DHCP", command: "NET DHCP" },
            { label: "WiFi DHCP", command: "WLAN DHCP" },
            { label: "Print Ethernet Config", command: "SELFTEST ETHERNET" },
            { label: "Print WiFi Config", command: "SELFTEST WLAN" },
        ],
    },
    {
        label: "Sensor",
        commands: [
            { label: "Read Gap Sensor", command: 'OUT GETSENSOR("GAP")' },
            { label: "Read Black Mark Sensor", command: 'OUT GETSENSOR("BLINE")' },
            { label: "Read Ribbon Sensor", command: 'OUT GETSENSOR("RIBBON")' },
            { label: "Read Peel Sensor", command: 'OUT GETSENSOR("PEEL")' },
            { label: "Head Open?", command: 'OUT GETSENSOR("HEAD UP")' },
            { label: "Head Temp", command: 'OUT GETSENSOR("HEAD TEMP")' },
            { label: "Head Voltage", command: 'OUT GETSENSOR("HEAD VOLT")' },
        ],
    },
    {
        label: "Clock",
        commands: [
            { label: "Get Date/Time", command: 'OUT NOW$()' },
        ],
    },
    {
        label: "System",
        commands: [
            { label: "Factory Reset", command: "INITIALPRINTER" },
            { label: "Restart Printer", command: "\x1B!C" },
            { label: "Dump Mode", command: "~!D" },
            { label: "Files on Printer", command: "FILES" },
            { label: "Clear Buffer", command: "CLS" },
            { label: "Pause", command: "\x1B!P" },
            { label: "Resume", command: "\x1B!O" },
        ],
    },
]