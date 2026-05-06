import { useState } from "react"

export function useFetch<T>() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [result, setResult] = useState<T>()

    async function execute(fn: () => Promise<T>) {
        setError(null)
        setLoading(true)
        try {
            setResult(await fn())
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return { loading, error, result, execute }
}