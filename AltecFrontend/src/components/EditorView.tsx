
type EditorViewProps = {
    sending: boolean
    onSend: (script: string) => Promise<string>
}

export default function EditorView({ sending, onSend }: EditorViewProps) {

}
