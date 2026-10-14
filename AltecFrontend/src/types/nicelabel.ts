

export type NiceLabelLabel = {
    labelSettings: NiceLabelLabelSettings,
    // printerSettings: NiceLabelPrinterSettings [i want to get density, speed, etc but not sure if the Nicelabel SDK returns these values from the label]
    conversionIssues: string[],
    variables: string[],
    functions: string[],
    labelObjects: string[],
    dataSets: NiceLabelLabelDataSet,
    filePath: string,
    author: string,
    title: string
}

export type NiceLabelLabelSettings = {
    width: number,
    height: number,
    originalPrinterName: string,
    originalPrinterDriver: string,
    pageLayout: NiceLabelLabelPageLayout
}

export type NiceLabelLabelPageLayout = {
    mediaWdith: number,
    mediaHeight: number,
    columns: number,
    rows: number,
    horizontalGap: number,
    verticalGap: number,
    horizontalOffset: number,
    verticalOffset: number,
    horizontalRadius: number,
    verticalRadius: number
}

export type NiceLabelLabelDataSet = {
    isFileDatabase: boolean,
    fileDatabaseFileName: string,
    connectionString: string, // is this secure???
    tableName: string,
    isCustomSql: boolean,
    customSql: string,
    fields: string[]
}
