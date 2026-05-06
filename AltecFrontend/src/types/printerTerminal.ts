export type CommandGroup = {
    label: string
    commands: { label: string; command: string }[]
}

export type CommandTab = "tspl" | "diagtool"

export type LogEntry = {
    type: "sent" | "received" | "error"
    text: string
    timestamp: string
}
