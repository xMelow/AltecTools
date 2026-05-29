
export type SerialNumberRequest = {
    excelFile: File,
    type: string
} 

export type SdCardRequest = {
    orderNumber: number,
    version: string,
    amount: number
} 