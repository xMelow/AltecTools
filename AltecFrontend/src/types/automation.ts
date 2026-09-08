
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
    ticketNumber: string,
    company: string,
    contactPerson: string,
    contactPersonPrefix: string,
    dontSendItems: string[],
    overige: string | undefined,
    multiplePrinters: boolean,
    model: string,
    street: string,
    problem1: string,
    problem2: string | undefined,
    place: string,
    serienummer: string,
    warrenty: string
}
