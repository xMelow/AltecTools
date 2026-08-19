import { useCallback, useState } from "react"

export function useFetch<T>() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [result, setResult] = useState<T | undefined>(undefined)

    const execute = useCallback(async (fn: () => Promise<T>): Promise<T | undefined> => {
        setError(null)
        setLoading(true)
        setResult(undefined)
        try {
            const fetchedResult = await fn()
            setResult(fetchedResult)
            return fetchedResult
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong')
            return undefined
        } finally {
            setLoading(false)
        }
    }, [])

    const reset = useCallback(() => {
        setResult(undefined)
        setError(null)
        setLoading(false)
    }, [])

    return { loading, error, result, execute, reset }
}
