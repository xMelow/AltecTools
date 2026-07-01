import { useRef, useState } from "react"
import { LogEntry } from "../types/printerTerminal"

type TerminalViewProps = {
    log: LogEntry[]
    sending: boolean
    onSend: (command: string) => Promise<void>
}

export default function TerminalView({ log, sending, onSend }: TerminalViewProps) {
    const [commandInput, setCommandInput] = useState("")
    const logEndRef = useRef<HTMLDivElement>(null)

    async function handleSend() {
        const command = commandInput.trim()
        if (!command) return
        setCommandInput("")
        await onSend(command)
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <>
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
                    onClick={() => handleSend()}
                    disabled={sending}
                >
                    {sending ? "..." : "Send"}
                </button>
            </div>
        </>
    )
}
