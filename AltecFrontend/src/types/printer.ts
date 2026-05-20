export type PrinterRequest = {
    subnets: string[]
}

export type PrinterResponse = {
    printers: Printer[]
}

export type Printer = {
    dnsName: string,
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
    networkName: string,
    sensorType: string,
    headOpenSensor: string,
    gapSize: number,
    gapOffset: number,
    speed: number,
    density: number,
    labelWidth: string,
    labelHeight: string,
    blineSize: number,
    direction: number,
    mirror: number,
    ribbon: string,
    offset: number,
    shiftX: number,
    shiftY: number,
    referenceX: number,
    referenceY: number,
    countryCode: string,
    codePage: string,
}

export type CommandResponse = {
    result: string
}

export type PrinterSettingsPanelProps = {
    ipAddress: string | undefined
    onNetworkName?: (name: string) => void
}

export type EditableSettings = {
    speed: string,
    density: string,
    labelWidth: string,
    labelHeight: string,
    blineSize: string,
    direction: string,
    mirror: number,
    ribbon: string,
    sensorType: string,
    gapSize: string,
    gapOffset: string,
    offset: string,
    shiftX: string,
    shiftY: string,
    referenceX: number,
    referenceY: number,
    countryCode: string,
    codePage: string,
}