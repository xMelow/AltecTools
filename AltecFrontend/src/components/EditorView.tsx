import { useState } from "react"

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

    async function handleSend() {
        try {
            const script = scriptInput.trim()
            if (!script) return
            const result = await onSend(script)
            setEditorStatus({type: "Success", message: result})
        } catch (err) {
            setEditorStatus({type: "Error", message: err instanceof Error ? err.message : "Failed to send script"})
        }
    }

    return (
        <div>
            {editorStatus !== undefined && (
                editorStatus?.type == "Success" ? (
                    <p className="text-altec-teal font-semibold">{editorStatus?.message}</p>
                ) : (
                    <p className="text-red-500">{editorStatus?.message}</p>
                )
            )}

            <textarea 
                value={scriptInput} 
                onChange={(e) => setScript(e.target.value)}
                disabled={sending}
                placeholder="Enter your script here..."
                rows={20}
            >

            </textarea>

            <button
                className="border bg-altec-teal text-altec-white px-4 rounded-xl self-stretch disabled:opacity-50"
                onClick={() => handleSend()}
                disabled={sending}
            >
                {sending ? "..." : "Send"}
            </button>
        </div>
    )
}
