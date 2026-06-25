import { useState } from "react"
import { sendPrinterFile } from "../api/printers"
import { FileEntry, PrinterFilesTabProps } from "../types/printerFiles"
import { useLocation } from "react-router-dom"

function newEntry(): FileEntry {
    return { id: String(Date.now() + Math.random()), file: null, fileName: "", memory: "" }
}

export default function PrinterFilesTab({address, sending, setSending, addLog }: PrinterFilesTabProps) {
    const [fileEntries, setFileEntries] = useState<FileEntry[]>([newEntry()])
    const location = useLocation()
    const connectionType = location.state?.connectionType ?? "Wifi"

    function addEntry() {
        setFileEntries(prev => [...prev, newEntry()])
    }

    function removeEntry(index: number) {
        setFileEntries(prev => prev.filter((_, i) => i !== index))
    }

    function handleFileChange(index: number, file: File | null) {
        setFileEntries(prev => prev.map((entry, i) =>
            i === index ? { ...entry, file, fileName: file?.name ?? entry.fileName } : entry
        ))
    }

    function updateEntry(index: number, field: "fileName" | "memory", value: string) {
        setFileEntries(prev => prev.map((entry, i) =>
            i === index ? { ...entry, [field]: value } : entry
        ))
    }

    async function handleSend() {
        const toSend = fileEntries.filter(e => e.file !== null)
        if (toSend.length === 0) return

        addLog("sent", `Files: ${toSend.map(e => e.fileName).join(", ")}`)
        setSending(true)
        try {
            const res = await sendPrinterFile(address, toSend.map(e => ({ file: e.file!, fileName: e.fileName, memory: e.memory })), connectionType)
            if (res.result) addLog("received", res.result)
        } catch (err) {
            addLog("error", err instanceof Error ? err.message : "Failed to send files")
        } finally {
            setSending(false)
            setFileEntries([newEntry()])
        }
    }

    return (
        <div className="flex flex-col gap-3">
            {fileEntries.map((entry, i) => (
                <div key={entry.id} className="flex flex-col gap-2 border border-altec-teal/40 rounded-xl p-3">
                    <div className="flex items-center justify-between">
                        <label className="flex-1 cursor-pointer">
                            <span className="text-sm text-altec-teal hover:underline truncate block">
                                {entry.file?.name ?? "Select file..."}
                            </span>
                            <input
                                type="file"
                                accept=".bas,.bmp"
                                className="hidden"
                                onChange={e => handleFileChange(i, e.target.files?.[0] ?? null)}
                            />
                        </label>
                        {fileEntries.length > 1 && (
                            <button
                                className="text-xs text-gray-400 hover:text-red-400 transition-colors ml-2 shrink-0"
                                onClick={() => removeEntry(i)}
                            >
                                ✕
                            </button>
                        )}
                    </div>
                    {entry.file && (
                        <>
                            <input
                                className="text-sm border border-altec-teal rounded-lg px-2 py-1 bg-altec-white focus:outline-none focus:ring-1 focus:ring-altec-teal"
                                value={entry.fileName}
                                onChange={e => updateEntry(i, "fileName", e.target.value)}
                                placeholder="Filename on printer"
                            />
                            <select
                                className="text-sm border border-altec-teal rounded-lg px-2 py-1 bg-altec-white"
                                value={entry.memory}
                                onChange={e => updateEntry(i, "memory", e.target.value)}
                            >
                                <option value="FLASH">FLASH</option>
                                <option value="DRAM">DRAM</option>
                                <option value="CARD">CARD</option>
                            </select>
                        </>
                    )}
                </div>
            ))}

            <button
                className="text-sm text-altec-teal border border-dashed border-altec-teal rounded-xl p-2 hover:bg-altec-light transition-colors"
                onClick={addEntry}
            >
                + Add File
            </button>

            <button
                className="border bg-altec-teal text-altec-white p-1.5 rounded-xl text-sm disabled:opacity-50"
                onClick={handleSend}
                disabled={!fileEntries.some(e => e.file !== null) || sending}
            >
                {sending ? "Sending..." : "Send to Printer"}
            </button>
        </div>
    )
}
