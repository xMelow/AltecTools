import { PrinterRequest, PrinterResponse, PrinterSettings, CommandResponse } from "../types/printer"

export async function getPrinters(data: PrinterRequest): Promise<PrinterResponse> {
    const params = new URLSearchParams()
    data.subnets.forEach(subnet => params.append('subnets', subnet))

    const res = await fetch(`/api/printer/discover?${params}`, {
        method: "GET",
    })

    if (!res.ok) throw new Error("Failed to fetch printers")

    return await res.json()
}

export async function getPrinterSettings(ipAddress: string): Promise<PrinterSettings> {
    const res = await fetch(`/api/printer/${encodeURIComponent(ipAddress)}/settings`)

    if (!res.ok) throw new Error("Failed to fetch printer settings")

    return await res.json()
}

export async function sendPrinterCommand(ipAddress: string, command: string): Promise<CommandResponse> {
    const res = await fetch(`/api/printer/${encodeURIComponent(ipAddress)}/command`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command }),
    })

    if (!res.ok) throw new Error("Failed to send command")

    return await res.json()
}