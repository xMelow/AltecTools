import { useState } from "react"
import { useFetch } from "../../hooks/useFetch"
import { SdCardRequest } from "../../types/automation"
import { previewSdCardLabel, printSdCard } from "../../api/automation"


export default function PrintSdCard() {
    const [orderNumber, setOrderNumber] = useState<number>()
    const [version, setVersion] = useState<string>("v1")
    const [amount, setAmount] = useState<number>(1)
    const { loading, error, result, execute } = useFetch<SdCardRequest>()
     const { loading: previewLoading, error: previewError, result: labelPreview, execute: executePreview } = useFetch<string>()

    function sendRequest() {
        if (orderNumber == null || version == null || amount == null || amount == 0) return

        execute(() => printSdCard({
            orderNumber: orderNumber,
            version: version,
            amount: amount
        }))
    }

    function getLabelPreview() {
        if (orderNumber == null || version == null || amount == null || amount == 0) return

        executePreview(() => previewSdCardLabel({
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

            <div className="flex flex-col gap-2 mb-4">
                <label className="text-xs font-semibold text-altec-teal uppercase tracking-wide mb-1">Order nummer</label>
                <input 
                    className="text-sm border border-altec-teal rounded-lg px-2 py-1.5 bg-altec-white focus:outline-none focus:ring-1 focus:ring-altec-teal" 
                    type="number"
                    id="orderNumber" 
                    name="orderNumber"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(Number(e.target.value))} />

                <label className="text-xs font-semibold text-altec-teal uppercase tracking-wide mb-1">Version</label>
                <input 
                    className="text-sm border border-altec-teal rounded-lg px-2 py-1.5 bg-altec-white focus:outline-none focus:ring-1 focus:ring-altec-teal" 
                    type="text"
                    id="version" 
                    name="version" 
                    value={version}
                    onChange={(e) => setVersion(e.target.value)} />

                <label className="text-xs font-semibold text-altec-teal uppercase tracking-wide mb-1">Amount</label>
                <input 
                    className="text-sm border border-altec-teal rounded-lg px-2 py-1.5 bg-altec-white focus:outline-none focus:ring-1 focus:ring-altec-teal" 
                    type="number"
                    id="amount" 
                    name="amount"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))} />
            </div>

            <p className="text-xs font-semibold text-altec-teal uppercase tracking-wide mb-1">Label Preview</p>
            <div className="mb-4">
                {labelPreview ? (
                    <img className="border border-altec-dark rounded-sm w-full" src={labelPreview} alt="Label preview" />
                ) : (
                    !previewLoading && <p className="text-xs text-gray-400">Preview will appear here...</p>
                )}
            </div>

            <button
                className="w-full border bg-altec-teal text-altec-white p-1.5 rounded-xl mt-2"
                onClick={sendRequest} 
                disabled={loading}
            >
                {loading ? 'Loading...' : 'Print'}
            </button>
        </div>
    )
}