export type PrinterRequest = {
    printerConnectionType: PrinterConnectionType
    subnets?: string[]
}

export type PrinterConnectionType = "Wifi" | "Usb"

export type PrinterResponse = {
    printers: Printer[]
}

export type Printer = {
    networkName: string,
    address: string,
    printerModel: string,
    port: number,
}

export type PrinterFile = {
    file: File
    fileName: string
    memory: string
}

export type PrinterSettings = {
    model: string,
    serial: string,
    version: string,
    checkSum: string,
    dpi: number,
    printerStatus: string,
    mileage: string,
    labelCounter: number,
    cutterCounter: number,
    macAddressNet: string,
    ipAddressNet: string,
    dnsName: string,
    sensorType: string,
    headOpenSensor: string,
    gapSize: number,
    gapOffset: number,
    postPrint: string,
    speed: number,
    density: number,
    labelWidth: number,
    labelHeight: number,
    blineSize: number,
    direction: number,
    mirror: number,
    ribbon: number,
    offset: number,
    shiftX: number,
    shiftY: number,
    referenceX: number,
    referenceY: number,
    countryCode: number,
    codePage: number,
}

export type CommandResponse = {
    result: string
}

export type PrinterSettingsPanelProps = {
    ipAddress: string | undefined
    onNetworkName?: (name: string) => void
}

export type EditableSettings = {
    postPrint: string,
    speed: number,
    density: number,
    labelWidth: number,
    labelHeight: number,
    blineSize: number,
    direction: number,
    mirror: number,
    ribbon: number,
    sensorType: string,
    gapSize: number,
    gapOffset: number,
    offset: number,
    shiftX: number,
    shiftY: number,
    referenceX: number,
    referenceY: number,
    countryCode: number,
    codePage: number,
}