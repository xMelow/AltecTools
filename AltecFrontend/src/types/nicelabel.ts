

export type NiceLabelLabel = {
    labelSettings: NiceLabelLabelSettings,
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
    dimensionUnit: number,
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
    tableName: string,
    isCustomSql: boolean,
    customSql: string,
    fields: string[]
}
