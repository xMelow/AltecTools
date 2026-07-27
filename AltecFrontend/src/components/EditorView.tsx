import { useEffect, useState } from "react"
import CodeEditorField from "./CodeEditorField"

type EditorStatus = {
    type: "Success" | "Error"
    message: string
}

type EditorViewProps = {
    sending: boolean
    onSend: (script: string) => Promise<string>
}

export default function EditorView({ sending, onSend }: EditorViewProps) {
    const [scriptInput, setScript] = useState("")
    const [editorStatus, setEditorStatus] = useState<EditorStatus | undefined>()
    const [showSuccess, setShowSuccess] = useState(false)

    async function handleSend() {
        try {
            const script = scriptInput.trim()
            if (!script) return
            const result = await onSend(script)
            setEditorStatus({type: "Success", message: result ? result : "Script sent"})
        } catch (err) {
            setEditorStatus({type: "Error", message: err instanceof Error ? err.message : "Failed to send script"})
        }
    }

    useEffect(() => {
        if (!editorStatus?.type) return
        setShowSuccess(true)
        const timer = setTimeout(() => setShowSuccess(false), 3000)
        return () => clearTimeout(timer)
    }, [editorStatus])

    return (
        <div className="">
            {showSuccess && (
                editorStatus?.type == "Success" ? (
                    <p className="text-altec-teal font-semibold">{editorStatus?.message}</p>
                ) : (
                    <p className="text-red-500">{editorStatus?.message}</p>
                )
            )}

            <CodeEditorField
                value={scriptInput}
                onChange={setScript}
                disabled={sending}
                placeholder="Enter your script here..."
                className="bg-altec-light rounded-xl p-3 text-sm font-mono w-185"
                height="24rem"
            />

            <div>
                <button
                    className="text-xs border border-altec-teal text-altec-teal px-2 py-0.5 rounded-lg hover:bg-altec-light transition-colors disabled:opacity-50"
                    onClick={() => setScript("")}
                >
                    Clear
                </button>
            </div>

            <div className="flex justify-end mt-1">
                <button
                    className="py-4 border bg-altec-teal text-altec-white px-4 rounded-xl self-stretch disabled:opacity-50"
                    onClick={() => handleSend()}
                    disabled={sending}
                >
                    {sending ? "..." : "Send"}
                </button>
            </div>
        </div>
    )
}
