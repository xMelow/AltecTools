
export type SerialNumberRequest = {
    csvFile: File,
    type: string
} 

export type SdCardRequest = {
    orderNumber: number,
    version: string,
    amount: number
} 