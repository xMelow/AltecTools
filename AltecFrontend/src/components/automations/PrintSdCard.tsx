import { useState } from "react"
import { useFetch } from "../../hooks/useFetch"
import { SdCardRequest } from "../../types/automation"
import { printSdCard } from "../../api/automation"


export default function PrintSdCard() {
    const [orderNumber, setOrderNumber] = useState<number>()
    const [version, setVersion] = useState<string>()
    const [amount, setAmount] = useState<number>()
    const { loading, error, result, execute } = useFetch<SdCardRequest>()

    function sendRequest() {
        if (orderNumber == null || version == null || amount == null || amount == 0) return

        (() => printSdCard({
            orderNumber: orderNumber,
            version: version,
            amount: amount
        }))
    }

    return (
        <div className="shadow-md rounded-2xl p-3 bg-white w-1/4">
            <h2 className="text-xl font-semibold pt-1 mb-2 text-center">Sd Kaart</h2>

            <hr className="border-b border-altec-teal mb-4" />

            {error && <p className="text-red-500">{error}</p>}

            <button
                className="w-full border bg-altec-teal text-altec-white p-1.5 rounded-xl mt-2"
                onClick={sendRequest} 
                disabled={loading}
            >
                {loading ? 'Loading...' : 'Print Labels'}
            </button>
        </div>
    )
}