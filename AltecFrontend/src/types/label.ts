export type LabelPreviewRequest = {
    tspl: string
    showBlockOutlines?: boolean
    images?: Record<string, string>
}

export type LabelPreviewResponse = {
    labelPreview: string
}

export type Label = {
    articleNumber: string,
    width: number,
    height: number,
    gap: number,
    labelsPerRow: number,
    totalLabels: number,
}

export type LabelOrder = {
    id: number,
    label: Label,
    labelRollsOrdered: number
}

export type ClientOrder = {
    foilLength: number,
    labelOrders: LabelOrder[],
}

export type CalculationResult = {
    foilNeeded: number,
    foilRollsNeeded: number,
    foilLastUsedPercentage: number,
    foilLastUsedNumber: number,
    breakDown: LabelBreakdown[]
}

export type LabelBreakdown = {
    articleNumber: string,
    orderedAmount: number,
    labelRollsForFullFoil: number,
    labelAmountForFullFoil: number,
    foilUsed: number,
    foilRollsNeeded: number,
    foilUsedPercentage: number
}