import { LogEntry } from "./printerTerminal"

export interface FileEntry {
    id: string
    file: File | null
    fileName: string
    memory: string
}

export type PrinterFilesTabProps = {
    ipAddress: string
    sending: boolean
    setSending: (v: boolean) => void
    addLog: (type: LogEntry["type"], text: string) => void
}
