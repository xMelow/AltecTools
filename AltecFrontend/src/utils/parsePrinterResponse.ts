

export function parsePrinterReponse(command: string, response: string): string {
    let result = response;

    if (command === "\x1B!?") {
        result = parseQuickStatus(response);
    }

    return result
}

function parseQuickStatus(response: string): string {
    const byte = response.charCodeAt(0)
    const messages: string[] = []

    if (byte & 0x01) messages.push("Head Opened")
    if (byte & 0x02) messages.push("Paper Jam")
    if (byte & 0x04) messages.push("Out of paper")
    if (byte & 0x08) messages.push("Out of ribbon")
    if (byte & 0x10) messages.push("Pause")
    if (byte & 0x20) messages.push("Printing")
    if (byte & 0x80) messages.push("Other error")

    return messages.length > 0 ? messages.join(", ") : "Normal"
}
