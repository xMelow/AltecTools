import { useState, useRef, useEffect } from "react"
import { useParams, useLocation } from "react-router-dom"
import { sendPrinterCommand } from "../api/printers"
import { CommandTab, LogEntry } from "../types/printerTerminal"
import { TSPL_COMMAND_GROUPS, DIAGTOOL_COMMAND_GROUPS } from "../constants/printerCommands"
import PrinterSettingsPanel from "../components/PrinterSettingsPanel";

export default function PrinterDetailedScreen() {
    const { ipAddress } = useParams<{ ipAddress: string }>()
    const [commandInput, setCommandInput] = useState("")
    const [log, setLog] = useState<LogEntry[]>([])
    const [sending, setSending] = useState(false)
    const [commandTab, setCommandTab] = useState<CommandTab>("diagtool")
    const logEndRef = useRef<HTMLDivElement>(null)
    const activeGroups = commandTab === "tspl" ? TSPL_COMMAND_GROUPS : DIAGTOOL_COMMAND_GROUPS

    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [log])

    function addLog(type: LogEntry["type"], text: string) {
        const timestamp = new Date().toLocaleTimeString()
        setLog(prev => [...prev, { type, text, timestamp }])
    }

    async function sendCommand(command: string) {
        if (!ipAddress) return
        addLog("sent", command)
        setSending(true)
        try {
            const res = await sendPrinterCommand(ipAddress, command)
            if (res.result) addLog("received", res.result)
        } catch (err) {
            addLog("error", err instanceof Error ? err.message : "Failed to send command")
        } finally {
            setSending(false)
        }
    }

    async function handleSend() {
        const trimmed = commandInput.trim()
        if (!ipAddress || !trimmed) return
        setCommandInput("")
        await sendCommand(trimmed)
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <div>
            <h2 className="text-center text-3xl font-bold text-altec-teal mb-4">
                {ipAddress}
            </h2>

            <div className="flex gap-4 items-start">

                {/* Command Buttons */}
                <div className="w-1/5 flex flex-col border rounded-2xl border-altec-teal bg-altec-white p-4 overflow-y-auto max-h-[75vh]">
                    <h3 className="text-lg font-semibold mb-2">Commands</h3>
                    <hr className="border-b border-altec-teal mb-3" />

                    <div className="flex gap-2 mb-3">
                        <button
                            className={`text-sm px-3 py-1 rounded-xl border border-altec-teal transition-colors ${
                                commandTab === "diagtool"
                                    ? "bg-altec-teal text-altec-white"
                                    : "bg-altec-white text-altec-teal hover:bg-altec-light"
                            }`}
                            onClick={() => setCommandTab("diagtool")}
                        >
                            DiagTool
                        </button>
                        <button
                            className={`text-sm px-3 py-1 rounded-xl border border-altec-teal transition-colors ${
                                commandTab === "tspl"
                                    ? "bg-altec-teal text-altec-white"
                                    : "bg-altec-white text-altec-teal hover:bg-altec-light"
                            }`}
                            onClick={() => setCommandTab("tspl")}
                        >
                            TSPL
                        </button>
                    </div>

                    <div className="flex flex-col gap-4">
                        {activeGroups.map(group => (
                            <div key={group.label}>
                                <p className="text-xs font-semibold text-altec-teal uppercase tracking-wide mb-1.5">
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
                </div>

                {/* Command Terminal */}
                <div className="flex-1 flex flex-col border rounded-2xl border-altec-teal bg-altec-white p-4 max-h-[75vh]">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold">Terminal</h3>
                        <button
                            className="text-xs text-gray-400 hover:text-red-400 transition-colors"
                            onClick={() => setLog([])}
                        >
                            Clear
                        </button>
                    </div>
                    <hr className="border-b border-altec-teal mb-3" />

                    {/* Log output */}
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

                    {/* Input area */}
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
                            disabled={sending || !ipAddress}
                        >
                            {sending ? "..." : "Send"}
                        </button>
                    </div>
                </div>

                <PrinterSettingsPanel ipAddress={ipAddress} />

            </div>
        </div>
    )
}
