import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { getPrinters, getPrinterSettings } from "../api/printers"
import {PrinterConnectionType, PrinterResponse} from "../types/printer"
import PrinterCard from "../components/PrinterCard"
import {useFetch} from "../hooks/useFetch";

export default function PrinterScreen() {
    const {loading, error, result, execute} = useFetch<PrinterResponse>()
    const [address, setAddress] = useState("")
    const [connecting, setConnecting] = useState(false)
    const [connectionType, setConnectionType] = useState<PrinterConnectionType>("Wifi")
    const [connectError, setConnectError] = useState<string | null>(null)
    const navigate = useNavigate()

    async function discoverPrinters() {
        const subnets = ["192.168.0.0/24", "192.168.1.0/24"]

        await execute(() => getPrinters({
            subnets: subnets,
            printerConnectionType: connectionType
        }))
    }

    async function connectToIp() {
        const ip = address.trim()
        if (!ip) return
        setConnecting(true)
        setConnectError(null)
        try {
            await getPrinterSettings(ip, connectionType)
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
        <div className="flex flex-col gap-6">
            <h2 className="text-center text-3xl font-bold text-altec-teal">Printers</h2>

            <div className="flex flex-row justify-center flex-wrap gap-4">
                {result?.printers?.map(el => (
                    <PrinterCard printer={el} key={el.address} />
                ))}
            </div>

            <div className="flex flex-col items-center gap-3">
                <div className="flex rounded-xl border border-altec-teal overflow-hidden">
                    {(["Wifi", "Usb"] as PrinterConnectionType[]).map(type => (
                        <button
                            key={type}
                            className={`px-5 py-1.5 text-sm font-medium transition-colors ${
                                connectionType === type
                                    ? "bg-altec-teal text-white"
                                    : "bg-white text-altec-teal hover:bg-altec-teal/10"
                            }`}
                            onClick={() => { setConnectionType(type); setAddress("") }}
                        >
                            {type === "Wifi" ? "WiFi" : "USB"}
                        </button>
                    ))}
                </div>

                <div className="flex gap-2">
                    {connectionType === "Wifi" && (
                        <button
                            className="border bg-altec-teal text-white px-3 py-1.5 rounded-xl text-sm disabled:opacity-50"
                            disabled={true}
                            onClick={discoverPrinters}
                        >
                            {loading ? "Searching..." : "Search"}
                        </button>
                    )}
                    <input
                        type="text"
                        className="border border-altec-teal rounded-xl px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-altec-teal w-64"
                        placeholder={connectionType === "Wifi" ? "Enter printer IP..." : "Enter USB port (e.g. USB001)..."}
                        value={address}
                        onChange={e => { setAddress(e.target.value); setConnectError(null) }}
                        onKeyDown={handleIpKeyDown}
                        disabled={connecting}
                    />
                    <button
                        className="bg-altec-teal text-white px-3 py-1.5 rounded-xl text-sm disabled:opacity-50"
                        onClick={connectToIp}
                        disabled={!address.trim() || connecting}
                    >
                        {connecting ? "Connecting..." : "Connect"}
                    </button>
                </div>

                {connectError && <p className="text-red-500 text-sm">{connectError}</p>}
                {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
        </div>
    )
}
