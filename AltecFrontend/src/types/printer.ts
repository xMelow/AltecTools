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
    dpi: number,
    model: string,
    serial: string,
    version: string,
    mileage: string,
    labelCounter: number,
    macAddressNet: string,
    ipAddressNet: string,
    networkName: string,
    sensorType: string,
    speed: number,
    density: number,
    labelWidth: string,
    labelHeight: string,
    gapSize: string,
    gapSizeOffset: string,
    blineSize: number,
    direction: string,
    ribbon: string,
    offset: number,
    shiftX: number,
    shiftY: number,
    countryCode: string,
    codePage: string,
    gapOffset: number,
}

export type CommandResponse = {
    result: string
}

export type PrinterSettingsPanelProps = {
    ipAddress: string | undefined
}

export type EditableSettings = {
    speed: string
    density: string
    direction: string
    ribbon: string
    sensorType: string
    labelWidth: string
    labelHeight: string
    gapSize: string
    gapSizeOffset: string
    gapOffset: string
    blineSize: string
    offset: string
    shiftX: string
    shiftY: string
    countryCode: string
    codePage: string
}