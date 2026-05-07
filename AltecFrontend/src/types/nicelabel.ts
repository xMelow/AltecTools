
export type SerialNumberRequest = {
    excelFile: File,
    type: string
} 

export type PreviewSerialNumbersRequest = {
    excelFile: File,
    type: string,
    width: number,
    height: number
}
