export type LabelPreviewRequest = {
    tspl: string
    showBlockOutlines?: boolean
    images?: Record<string, string>
}

export type LabelPreviewResponse = {
    labelPreview: string
}