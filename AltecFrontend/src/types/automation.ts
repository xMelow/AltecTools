
export type SerialNumberRequest = {
    csvFile: File,
    type: string
} 

export type SdCardRequest = {
    orderNumber: number,
    version: string,
    amount: number
}

export type TestRoomRequest = {
    sensorType: string
    speed: number
    density: number
    cutter: boolean
    userLabel: boolean
    printer: string
}

export type QlickPrintRequest = {
    dataFile: File
}
