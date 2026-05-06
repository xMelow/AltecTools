import { CommandGroup } from "../types/printerTerminal"

export const TSPL_COMMAND_GROUPS: CommandGroup[] = [
    {
        label: "Status & Diagnostics",
        commands: [
            { label: "Status", command: "STATUS" },
            { label: "Get Config", command: "GET CONFIG" },
            { label: "Self Test", command: "SELFTEST" },
            { label: "Self Test Page", command: "SELFTEST PAGE" },
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
            { label: "Calibrate", command: "CALIBRATE" },
            { label: "Gap Detect", command: "GAPDETECT" },
            { label: "Black Mark Detect", command: "BLINEDETECT" },
            { label: "Auto Detect", command: "AUTODETECT" },
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
            { label: "Calibrate Sensor", command: "AUTODETECT" },
            { label: "Calibrate Gap Sensor", command: "GAPDETECT" },
            { label: "Calibrate Black Mark Sensor", command: "BLINEDETECT" },
        ],
    },
    {
        label: "Print",
        commands: [
            { label: "Print Test Page", command: "SELFTEST PAGE" },
            { label: "Print Configuration", command: "SELFTEST" },
            { label: "Feed Label", command: "FEED" },
            { label: "Form Feed", command: "FORMFEED" },
        ],
    },
    {
        label: "Network",
        commands: [
            { label: "Ethernet Setup", command: "GET ETHERNET" },
            { label: "WiFi Setup", command: "GET WLAN" },
            { label: "Set DHCP", command: "SET IP DHCP" },
        ],
    },
    {
        label: "Clock",
        commands: [
            { label: "RTC Setup", command: "GET RTC" },
        ],
    },
    {
        label: "System",
        commands: [
            { label: "Factory Default", command: "INITIALPRINTER" },
            { label: "Reset Printer", command: "RESET" },
            { label: "Dump Mode", command: "DUMP" },
            { label: "Clear Buffer", command: "CLS" },
        ],
    },
]
