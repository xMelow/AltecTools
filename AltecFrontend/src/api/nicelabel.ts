import { PreviewSerialNumbersRequest, SerialNumberRequest } from "../types/nicelabel";

export async function printSerialNumbers(body: SerialNumberRequest) {
    const formData = new FormData()
    formData.append('excelFile', body.excelFile)
    formData.append('printerType', body.type)

    const res = await fetch(`/api/automation/serialNumbersNewPrinters`, {
        method: 'POST',
        body: formData
    })

    if (!res.ok) throw new Error("Failed to print serial numbers")

    return await res.json()
}

export async function previewSerialNumbers(body: PreviewSerialNumbersRequest): Promise<string> {
    const formData = new FormData()
    formData.append('excelFile', body.excelFile)
    formData.append('printerType', body.type)
    formData.append('width', body.width.toString())
    formData.append('height', body.height.toString())

    const res = await fetch(`/api/automation/serialNumbersLabelPreview`, {
        method: 'POST',
        body: formData
    })

    if (!res.ok) throw new Error("Failed to get serial numbers label preview")

    const blob = await res.blob()
    return URL.createObjectURL(blob)
}
