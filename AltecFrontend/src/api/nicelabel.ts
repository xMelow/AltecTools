import { NiceLabelLabel } from "../types/nicelabel"
import { Printer } from "../types/printer"

export async function getPrintersList(): Promise<Printer[]> {
    const res = await fetch(`/api/nicelabel/printers`)

    if (!res.ok) throw new Error("Failed to get printers")

    const data = await res.json()
    return data
}

export async function getNiceLabelLabelDetails(file: File): Promise<NiceLabelLabel> {
    const formData = new FormData()
    formData.append("niceLabelLabelFile", file)
    
    const res = await fetch(`/api/nicelabel/labelDetails`, {
        method: 'GET',
        body: formData
    })

    if (!res.ok) throw new Error("Failed to get label details")

    const data = await res.json()
    return data
}
