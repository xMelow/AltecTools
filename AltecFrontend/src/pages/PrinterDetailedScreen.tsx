import { useState, useRef, useEffect } from "react"
import { Link, useLocation, useParams } from "react-router-dom"
import { sendPrinterCommand } from "../api/printers"
import { LogEntry } from "../types/printerTerminal"
import { PRINTER_COMMAND_GROUPS } from "../constants/printerCommands"
import PrinterSettingsPanel from "../components/PrinterSettings"
import PrinterFilesTab from "../components/PrinterFilesTab"
import { parsePrinterReponse } from "../utils/parsePrinterResponse"

export default function PrinterDetailedScreen() {
    const { ipAddress } = useParams<{ ipAddress: string }>()
    const [dnsName, setDnsName] = useState<string>()
    const [commandInput, setCommandInput] = useState("")
    const [log, setLog] = useState<LogEntry[]>([])
    const [sending, setSending] = useState(false)
    const [commandTab, setCommandTab] = useState<string>("printer")
    const [terminalTab, setTerminalTab] = useState<string>("terminal")
    const logEndRef = useRef<HTMLDivElement>(null)
    const activeGroups = PRINTER_COMMAND_GROUPS
    const address = decodeURIComponent(ipAddress ?? "")
    const location = useLocation()
    const connectionType = location.state?.connectionType ?? "Wifi"
    const printerName = location.state?.name

    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [log])

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

    async function handleSend() {
        const command = commandInput.trim()
        if (!address || !command) return
        setCommandInput("")
        await sendCommand(command)
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
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

                <div className="flex-1 flex flex-col border rounded-2xl border-altec-teal bg-altec-white p-4 max-h-[75vh]">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold">Terminal</h3>
                        <button
                            className="text-xs border border-altec-teal text-altec-teal px-2 py-0.5 rounded-lg hover:bg-altec-light transition-colors disabled:opacity-50"
                            onClick={() => setLog([])}
                        >
                            Clear
                        </button>
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

                    <div className="flex-1 bg-altec-light rounded-xl p-3 font-mono text-sm overflow-y-auto mb-3 min-h-64">
                        {log.length === 0 && (
                            <p className="text-gray-400 text-xs">Send a command to see output here...</p>
                        )}
                        {log.map((entry, i) => (
                            <div key={i} className="mb-1 leading-snug">
                                {entry.type === "sent" && (
                                    <span className="text-altec-teal font-semibold">&gt; {entry.text}</span>
                                )}
                                {entry.type === "received" && (
                                    <span className="text-altec-dark whitespace-pre-wrap">{entry.text}</span>
                                )}
                                {entry.type === "error" && (
                                    <span className="text-red-500">{entry.text}</span>
                                )}
                            </div>
                        ))}
                        <div ref={logEndRef} />
                    </div>

                    <div className="flex gap-2">
                        <textarea
                            className="flex-1 border border-altec-teal rounded-xl p-2 text-sm font-mono resize-none bg-altec-white focus:outline-none focus:ring-1 focus:ring-altec-teal"
                            rows={3}
                            value={commandInput}
                            onChange={e => setCommandInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Enter TSPL command... (Enter to send, Shift+Enter for new line)"
                            disabled={sending}
                        />
                        <button
                            className="border bg-altec-teal text-altec-white px-4 rounded-xl self-stretch disabled:opacity-50"
                            onClick={handleSend}
                            disabled={sending || !address}
                        >
                            {sending ? "..." : "Send"}
                        </button>
                    </div>
                </div>

                <PrinterSettingsPanel address={address} onNetworkName={setDnsName} connectionType={connectionType}/>

            </div>
        </div>
    )
}
