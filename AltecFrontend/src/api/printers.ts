import { PrinterRequest, PrinterResponse, PrinterSettings, CommandResponse, PrinterConnectionType, PrinterFile } from "../types/printer"

export async function getPrinters(data: PrinterRequest): Promise<PrinterResponse> {
    const params = new URLSearchParams()
    params.append("connectionType", data.printerConnectionType)

    if (data.subnets != null) 
        data.subnets.forEach(subnet => params.append('subnets', subnet))

    const res = await fetch(`/api/printer/discover?${params}`, {
        method: "GET",
    })

    if (!res.ok) throw new Error("Failed to fetch printers")

    return await res.json()
}

export async function getPrinterSettings(address: string, printerConnectionType: PrinterConnectionType): Promise<PrinterSettings> {
    const params = new URLSearchParams()
    params.append("connectionType", printerConnectionType)

    const res = await fetch(`/api/printer/getPrinterInfo/${encodeURIComponent(address)}?${params}`)

    if (!res.ok) throw new Error("Failed to fetch printer settings")

    return await res.json()
}

export async function sendPrinterCommand(address: string, command: string, printerConnectionType: PrinterConnectionType): Promise<CommandResponse> {
    const params = new URLSearchParams()
    params.append("connectionType", printerConnectionType)

    const res = await fetch(`/api/printer/command/${encodeURIComponent(address)}?${params}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command }),
    })

    if (!res.ok) throw new Error("Failed to send command")
        
    return await res.json()
}

export async function sendPrinterFile(address: string, entries: PrinterFile[], printerConnectionType: PrinterConnectionType): Promise<string> {
    const params = new URLSearchParams()
    params.append("connectionType", printerConnectionType)

    const formData = new FormData()
    entries.forEach((file) => {
        formData.append("files", file.file)
        formData.append("fileNames", file.fileName)
        formData.append("memories", file.memory)
    })

    const res = await fetch(`/api/printer/file/${encodeURIComponent(address)}?${params}`, {
        method: "POST",
        body: formData,
    })

    if (!res.ok) throw new Error("Failed to send file")
    return await res.text()
}
