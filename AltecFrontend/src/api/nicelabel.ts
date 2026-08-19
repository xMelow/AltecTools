

export async function getPrinters(): Promise<string[]> {
    const res = await fetch(`/api/nicelabel/printers`)

    if (!res.ok) throw new Error("Failed to get printers")

    const data = await res.json()
    return data
}
