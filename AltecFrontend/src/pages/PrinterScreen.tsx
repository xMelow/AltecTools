import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { getPrinters, getPrinterSettings } from "../api/printers"
import {PrinterResponse} from "../types/printer"
import PrinterCard from "../components/PrinterCard"
import {useFetch} from "../hooks/useFetch";

export default function PrinterScreen() {
    const {loading, error, result, execute} = useFetch<PrinterResponse>()
    const [ipInput, setIpInput] = useState("")
    const [connecting, setConnecting] = useState(false)
    const [connectError, setConnectError] = useState<string | null>(null)
    const navigate = useNavigate()

    async function discoverPrinters() {
        const subnets = ["192.168.0.0/24", "192.168.1.0/24"]

        await execute(() => getPrinters({
            subnets: subnets
        }))
    }

    async function connectToIp() {
        const ip = ipInput.trim()
        if (!ip) return
        setConnecting(true)
        setConnectError(null)
        try {
            await getPrinterSettings(ip)
            navigate(`/printers/${ip}`)
        } catch {
            setConnectError(`Could not connect to ${ip}`)
        } finally {
            setConnecting(false)
        }
    }

    function handleIpKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") connectToIp()
    }

    return (
        <div className="">
            <h2 className="text-center text-3xl font-bold text-altec-teal mb-3">Printers</h2>

            {error && <p className="text-red-500">{error}</p>}

            <div className="flex flex-row justify-center flex-wrap gap-4">
                {result?.printers?.map(el => (
                    <PrinterCard printer={el} key={el.ipAddress} />
                ))}
            </div>

            <div className="flex flex-col gap-1 mt-2">
                <div className="flex gap-2">
                    <button
                        className="border bg-altec-teal text-altec-white p-1.5 rounded-xl"
                        disabled={true}
                        onClick={discoverPrinters}
                    >
                        {loading ? "Loading..." : "Search Printers"}
                    </button>

                    <input
                        type="text"
                        className="border border-altec-teal rounded-xl px-3 py-1.5 text-sm bg-altec-white focus:outline-none focus:ring-1 focus:ring-altec-teal"
                        placeholder="Enter printer IP..."
                        value={ipInput}
                        onChange={e => { setIpInput(e.target.value); setConnectError(null) }}
                        onKeyDown={handleIpKeyDown}
                        disabled={connecting}
                    />
                    <button
                        className="border bg-altec-teal text-altec-white p-1.5 rounded-xl disabled:opacity-50"
                        onClick={connectToIp}
                        disabled={!ipInput.trim() || connecting}
                    >
                        {connecting ? "Connecting..." : "Connect"}
                    </button>
                </div>
                {connectError && <p className="text-red-500 text-sm">{connectError}</p>}
            </div>
        </div>
    )
}
