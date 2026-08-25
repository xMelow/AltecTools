import { QlickPrintRequest, SdCardRequest, SerialNumberRequest, TestRoomRequest } from "../types/automation";

export async function printSerialNumbers(body: SerialNumberRequest): Promise<string> {
    const formData = new FormData()
    formData.append('csvFile', body.csvFile)
    formData.append('printerType', body.type)

    const res = await fetch(`/api/automation/serialNumbersNewPrinters`, {
        method: 'POST',
        body: formData
    })

    if (!res.ok) throw new Error("Failed to print serial numbers labels")

    return await res.text()
}

export async function previewSerialNumbers(body: SerialNumberRequest): Promise<string[]> {
    const formData = new FormData()
    formData.append('csvFile', body.csvFile)
    formData.append('printerType', body.type)

    const res = await fetch(`/api/automation/serialNumbersLabelPreview`, {
        method: 'POST',
        body: formData
    })

    if (!res.ok) throw new Error("Failed to get serial numbers label preview")

    return await res.json()
}

export async function printSdCard(body: SdCardRequest): Promise<string> {
    const formData = new FormData()
    formData.append('orderNumber', body.orderNumber.toString())
    formData.append('version', body.version)
    formData.append('amount', body.amount.toString())

    const res = await fetch(`/api/automation/sdCard`, {
        method: 'POST',
        body: formData
    })

    if (!res.ok) throw new Error("Failed to print SD card label")

    return await res.text()
}

export async function previewSdCardLabel(body: SdCardRequest): Promise<string> {
    const formData = new FormData()
    formData.append('orderNumber', body.orderNumber.toString())
    formData.append('version', body.version)

    const res = await fetch(`/api/automation/sdCardPreview`, {
        method: 'POST',
        body: formData
    })

    if (!res.ok) throw new Error("Failed to get SD Card preview")

    const data = await res.json()

    return data.image
}

export async function printTestRoom(body: TestRoomRequest): Promise<string> {
    const formData = new FormData()
    formData.append('sensorType', body.sensorType)
    formData.append('speed', body.speed.toString())
    formData.append('density', body.density.toString())
    formData.append('cutter', body.cutter.toString())
    formData.append('userLabel', body.userLabel.toString())
    formData.append('printer', body.printer)

    const res = await fetch(`/api/automation/testRoom`, {
        method: 'POST',
        body: formData
    })

    if (!res.ok) throw new Error("Failed to print test room label")

    return await res.text()
}

export async function printQlickPrintLicensie(body: QlickPrintRequest): Promise<string> {
    const formData = new FormData()
    formData.append('dataFile', body.dataFile)

    const res = await fetch(`/api/automation/qlickPrintLicensie`, {
        method: 'POST',
        body: formData
    })

    if (!res.ok) throw new Error("Failed to print QlickPrint licensies")

    return await res.json()
}
