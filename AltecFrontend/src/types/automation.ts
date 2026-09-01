
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

export type GeneratePdfRequest = {
    language: string,
    ticketNumber: number,
    company: string,
    contactPerson: string,
    contactPersonPrefix: string,
    dontSendItems: string[],
    model: string,
    street: string,
    problem1: string,
    problem2: string,
    place: string,
    serienummer: number,
    warrenty: string
}
