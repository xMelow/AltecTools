import { LabelPreview, LabelPreviewRequest } from "../types/label";

export async function getLabelPreview(data: LabelPreviewRequest): Promise<LabelPreview> {
    const res = await fetch('/api/tspl/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message)
    }

    const response = await res.json()
    const labelPreview = {src: "data:image/png;base64," + response.labelPreview, labelWidth: response.previewWidth, labelHeight: response.previewHeight }

    return labelPreview
}
