export type PrinterRequest = {
    subnets: string[]
}

export type PrinterResponse = {
    printers: Printer[]
}

export type Printer = {
    networkName: string,
    ipAddress: string,
    printerModel: string,
    port: number,
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