import { SerialNumberRequest } from "../types/nicelabel";

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
