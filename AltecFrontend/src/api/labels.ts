import { LabelPreviewRequest } from "../types/label";

export async function getLabelPreview(data: LabelPreviewRequest): Promise<string> {
    const res = await fetch('/api/tspl/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message)
    }

    const blob = await res.blob()
    return URL.createObjectURL(blob)
}
