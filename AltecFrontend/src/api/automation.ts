import { SdCardRequest, SerialNumberRequest } from "../types/automation";

export async function printSerialNumbers(body: SerialNumberRequest) {
    const formData = new FormData()
    formData.append('excelFile', body.excelFile)
    formData.append('printerType', body.type)

    const res = await fetch(`/api/automation/serialNumbersNewPrinters`, {
        method: 'POST',
        body: formData
    })

    if (!res.ok) throw new Error("Failed to print serial numbers labels")

    return await res.json()
}

export async function previewSerialNumbers(body: SerialNumberRequest): Promise<string[]> {
    const formData = new FormData()
    formData.append('excelFile', body.excelFile)
    formData.append('printerType', body.type)

    const res = await fetch(`/api/automation/serialNumbersLabelPreview`, {
        method: 'POST',
        body: formData
    })

    if (!res.ok) throw new Error("Failed to get serial numbers label preview")

    return await res.json()
}

export async function printSdCard(body: SdCardRequest) {
    const formData = new FormData()
    formData.append('orderNumber', body.orderNumber.toString())
    formData.append('version', body.version)
    formData.append('amount', body.amount.toString())

    const res = await fetch(`/api/automation/sdCard`, {
        method: 'POST',
        body: formData
    })

    if (!res.ok) throw new Error("Failed to print SD card label")

    return await res.json()
}

export async function previewSdCardLabel(body: SdCardRequest): Promise<string> {
    const formData = new FormData()
    formData.append('orderNumber', body.orderNumber.toString())
    formData.append('version', body.version)
    formData.append('amount', body.amount.toString())

    const res = await fetch(`/api/automation/sdCardPreview`, {
        method: 'POST',
        body: formData
    })

    if (!res.ok) throw new Error("Failed to get SD Card preview")

    return await res.json()
}
