import { LabelPreviewRequest, LabelPreviewResponse } from "../types/label";

export async function getLabelPreview(data: LabelPreviewRequest): Promise<string> {
    const res = await fetch('/api/tspl/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })

    if (!res.ok) throw new Error("Failed to fetch label preview")

    const blob = await res.blob()
    return URL.createObjectURL(blob)
}
