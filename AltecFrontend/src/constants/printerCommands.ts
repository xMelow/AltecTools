import { CommandGroup } from "../types/printerTerminal"

export const PRINTER_COMMAND_GROUPS: CommandGroup[] = [
    {
        label: "System",
        commands: [
            { label: "Default Settings", command: "INITIALPRINTER" },
            { label: "Restart Printer", command: "\x1B!C" },
            { label: "Ignore AUTO.BAS", command: "\x1B!Q" },
            { label: "Dump Mode", command: "~!D" },
            { label: "Files on Printer", command: "FILES" },
            { label: "Pause", command: "\x1B!P" },
            { label: "Resume", command: "\x1B!O" },
            { label: "Reset", command: "RESET" },
        ],
    },
    {
        label: "Calibration",
        commands: [
            { label: "Auto Detect", command: "AUTODETECT" },
            { label: "Gap Sensor Detect", command: "GAPDETECT" },
            { label: "Black Mark Detect", command: "BLINEDETECT" },
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
        label: "Print Buffer",
        commands: [
            { label: "Clear Buffer", command: "CLS" },
        ],
    },
    {
        label: "Printer Options",
        commands: [
            { label: "Tear On", command: "SET TEAR ON" },
            { label: "Tear Off", command: "SET TEAR OFF" },
            { label: "Peel On", command: "SET PEEL ON" },
            { label: "Peel Off", command: "SET PEEL OFF" },
            { label: "Cutter On", command: "SET CUTTER ON" },
            { label: "Cutter Off", command: "SET CUTTER OFF" },
            { label: "Reprint On", command: "SET REPRINT ON" },
            { label: "Reprint Off", command: "SET REPRINT OFF" },
        ],
    },
    {
        label: "Keys",
        commands: [
            { label: "Key1 On", command: "SET KEY1 ON" },
            { label: "Key1 Off", command: "SET KEY1 OFF" },
            { label: "Key2 On", command: "SET KEY2 ON" },
            { label: "Key2 Off", command: "SET KEY2 OFF" },
            { label: "Key3 On", command: "SET KEY3 ON" },
            { label: "Key3 Off", command: "SET KEY3 OFF" },
            { label: "Key4 On", command: "SET KEY4 ON" },
            { label: "Key4 Off", command: "SET KEY4 OFF" },
            { label: "Key5 On", command: "SET KEY5 ON" },
            { label: "Key5 Off", command: "SET KEY5 OFF" },
            { label: "Key6 On", command: "SET KEY6 ON" },
            { label: "Key6 Off", command: "SET KEY6 OFF" },
        ],
    },
        {
        label: "Program",
        commands: [
            { label: "Exit BAS", command: "END" },
            { label: "Go to Menu", command: "GOTO START" },
        ],
    },
]