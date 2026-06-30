

export function parsePrinterReponse(command: string, response: string): string {
    let result = response;

    if (command === "\x1B!?") result = parseQuickStatus(response);
    else if (command === "\x1B!S") result = parseFullStatus(response)

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

function parseFullStatus(response: string): string {
    const statusByte = response.charCodeAt(0)
    const warningByte = response.charCodeAt(1)
    const errorByte = response.charCodeAt(2)
    const errorByte2 = response.charCodeAt(3)
    const status = statusByte & ~0x40
    const warning = warningByte & ~0x40
    const internalError = errorByte & ~0x40
    const externalError = errorByte2 & ~0x40
    const messages: string[] = []

    switch(status) {
        case 0x20: 
            messages.push("Pause")
            break
        case 0x02: 
            messages.push("Backing label")
            break
        case 0x03: 
            messages.push("Cutting")
            break
        case 0x05: 
            messages.push("Printer error")
            break
        case 0x06: 
            messages.push("Form feed")
            break
        case 0x0B: 
            messages.push("Waiting to press print key") 
            break
        case 0x10: 
            messages.push("Printing batch")
            break
        case 0x17: 
            messages.push("Imaging")
            break
        default:
            messages.push("Normal") 
            break 
    }

    if (warning & 0x01) messages.push("Paper low")
    if (warning & 0x02) messages.push("Ribbon low")
    if (warning & 0x08) messages.push("Receive buffer full")

    if (internalError & 0x01) messages.push("Print head overheat")
    if (internalError & 0x02) messages.push("Stepping motor overheat")
    if (internalError & 0x04) messages.push("Print head error")
    if (internalError & 0x08) messages.push("Cutter jam")
    if (internalError & 0x10) messages.push("Insufficient memory")

    if (externalError & 0x01) messages.push("Paper empty")
    if (externalError & 0x02) messages.push("Paper jam")
    if (externalError & 0x04) messages.push("Ribbon empty")
    if (externalError & 0x08) messages.push("Ribbon jam")
    if (externalError & 0x20) messages.push("Print head open")

    return messages.join(", ")
}
