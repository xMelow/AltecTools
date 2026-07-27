import { useState } from "react"
import { Link, useLocation, useParams } from "react-router-dom"
import { sendPrinterCommand } from "../api/printers"
import { LogEntry } from "../types/printerTerminal"
import { PRINTER_COMMAND_GROUPS } from "../constants/printerCommands"
import PrinterSettingsPanel from "../components/PrinterSettings"
import PrinterFilesTab from "../components/PrinterFilesTab"
import { parsePrinterReponse } from "../utils/parsePrinterResponse"
import TerminalView from "../components/TerminalView"
import EditorView from "../components/EditorView"

export default function PrinterDetailedScreen() {
    const { ipAddress } = useParams<{ ipAddress: string }>()

    const [dnsName, setDnsName] = useState<string>()
    const [log, setLog] = useState<LogEntry[]>([])
    const [sending, setSending] = useState(false)
    const [commandTab, setCommandTab] = useState<string>("printer")
    const [terminalTab, setTerminalTab] = useState<string>("terminal")

    const activeGroups = PRINTER_COMMAND_GROUPS
    const address = decodeURIComponent(ipAddress ?? "")
    const location = useLocation()
    const connectionType = location.state?.connectionType ?? "Wifi"
    const printerName = location.state?.name

    function addLog(type: LogEntry["type"], text: string) {
        const timestamp = new Date().toLocaleTimeString()
        setLog(prev => [...prev, { type, text, timestamp }])
    }

    async function sendCommand(command: string) {
        if (!address) return
        addLog("sent", command)

        setSending(true)
        try {
            const res = await sendPrinterCommand(address, command, connectionType)
            const result = parsePrinterReponse(command, res.result)
            if (res.result) addLog("received", result)
        } catch (err) {
            addLog("error", err instanceof Error ? err.message : "Failed to send command")
        } finally {
            setSending(false)
        }
    }

    async function sendScript(script: string): Promise<string> {
        if (!address) throw new Error("No address")
        setSending(true)

        try {
            const res = await sendPrinterCommand(address, script, connectionType)
            return res.result
        } catch (err) {
            throw new Error(err instanceof Error ? err.message : "Failed to send script")
        } finally {
            setSending(false)
        }
    }

    return (
        <div>
            <div className="flex items-center mb-4">
                <Link 
                    to={"/printers"} 
                    className="text-sm px-3 py-1 rounded-xl border border-altec-teal bg-altec-teal text-altec-white"
                    state={{ connectionType }}
                >
                    {"< back"}
                </Link>

                <h2 className="flex-1 text-center text-3xl font-bold text-altec-teal">
                    {printerName || dnsName || "Not found"}
                </h2>
            </div>

            <div className="flex gap-4 items-start">

                <div className="w-1/5 flex flex-col border rounded-2xl border-altec-teal bg-altec-white max-h-[75vh]">
                    <div className="px-4 pt-4 shrink-0">
                        <h3 className="text-lg font-semibold mb-2">Printer Commands</h3>
                        <hr className="border-b border-altec-teal mb-3" />
                        <div className="flex gap-2 mb-3">
                            <button
                                className={`text-sm px-3 py-1 rounded-xl border border-altec-teal transition-colors ${
                                    commandTab === "printer"
                                        ? "bg-altec-teal text-altec-white"
                                        : "bg-altec-white text-altec-teal hover:bg-altec-light"
                                }`}
                                onClick={() => setCommandTab("printer")}
                            >
                                Commands
                            </button>
                            <button
                                className={`text-sm px-3 py-1 rounded-xl border border-altec-teal transition-colors ${
                                    commandTab === "files"
                                        ? "bg-altec-teal text-altec-white"
                                        : "bg-altec-white text-altec-teal hover:bg-altec-light"
                                }`}
                                onClick={() => setCommandTab("files")}
                            >
                                Files
                            </button>
                        </div>
                    </div>

                    <div className="overflow-y-auto px-4 pb-4 grow">
                        {commandTab === "files" ? (
                            <PrinterFilesTab
                                address={address!}
                                sending={sending}
                                setSending={setSending}
                                addLog={addLog}
                            />
                        ) : (
                            <div className="flex flex-col gap-4">
                                {activeGroups.map(group => (
                                    <div key={group.label}>
                                        <p className="sticky top-0 z-10 bg-altec-white text-xs font-semibold text-altec-teal uppercase tracking-wide py-1 mb-1">
                                            {group.label}
                                        </p>
                                        <div className="flex flex-col gap-1">
                                            {group.commands.map(cmd => (
                                                <button
                                                    key={cmd.command}
                                                    className="text-left text-sm border border-altec-teal rounded-lg px-2 py-1.5 hover:bg-altec-light transition-colors disabled:opacity-40"
                                                    onClick={() => sendCommand(cmd.command)}
                                                    disabled={sending}
                                                >
                                                    {cmd.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-1 flex flex-col border rounded-2xl border-altec-teal bg-altec-white p-4 max-h-[75vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold">Terminal</h3>
                    </div>
                    <hr className="border-b border-altec-teal mb-3" />

                    <div className="flex gap-2 mb-3">
                        <button
                            className={`text-sm px-3 py-1 rounded-xl border border-altec-teal transition-colors ${
                                terminalTab === "terminal"
                                    ? "bg-altec-teal text-altec-white"
                                    : "bg-altec-white text-altec-teal hover:bg-altec-light"
                            }`}
                            onClick={() => setTerminalTab("terminal")}
                        >
                            Terminal
                        </button>
                        <button
                            className={`text-sm px-3 py-1 rounded-xl border border-altec-teal transition-colors ${
                                terminalTab === "editor"
                                    ? "bg-altec-teal text-altec-white"
                                    : "bg-altec-white text-altec-teal hover:bg-altec-light"
                            }`}
                            onClick={() => setTerminalTab("editor")}
                        >
                            Editor
                        </button>
                    </div>

                    <div className={terminalTab === "terminal" ? "" : "hidden"}> 
                        <TerminalView log={log} sending={sending} onSend={(command) => sendCommand(command)} onClear={() => setLog([])}/>
                    </div>

                    <div className={terminalTab === "editor" ? "" : "hidden"}> 
                        <EditorView sending={sending} onSend={(script) => sendScript(script)}/>
                    </div>
                </div>

                <PrinterSettingsPanel address={address} onNetworkName={setDnsName} connectionType={connectionType}/>

            </div>
        </div>
    )
}
