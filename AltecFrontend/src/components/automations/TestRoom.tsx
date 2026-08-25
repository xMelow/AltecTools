import { useEffect, useState } from "react"
import AutomationSpecs from "./AutomationSpecs"
import { useFetch } from "../../hooks/useFetch"
import { getPrintersList } from "../../api/nicelabel"
import { Printer } from "../../types/printer"
import { printTestRoom } from "../../api/automation"

export default function TestRoom() {
    const [sensor, setSensor] = useState<string>("Gap")
    const [speed, setSpeed] = useState<number>(2)
    const [density, setDensity] = useState<number>(8)
    const [printer, setPrinter] = useState<string>()
    const [printerList, setPrinterList] = useState<Printer[]>([])
    const [cutter, setCutter] = useState<boolean>(false)
    const [userLabel, setUserLabel] = useState<boolean>(false)
    const { loading, error, result, execute } = useFetch<Printer[]>()
    const { loading: loadingPrint, error: errorPrint, result: resultPrint, execute: executePrint } = useFetch<string>()
    
    async function sendPrint() {
        if (printer == undefined) return
        await executePrint(() => printTestRoom({
            sensorType: sensor,
            speed: speed,
            density: density,
            cutter: cutter,
            userLabel: userLabel,
            printer: printer
        }))
    }

    useEffect(() => {
        async function getPrinters() {        
            const response = await execute(() => getPrintersList())
            if (response != undefined) {
                setPrinterList(response)
                setPrinter(response.find(p => p.name === "Altec ATP-300 Pro")?.name ?? response[0]?.name)
            }
        }
        
        getPrinters()
    }, [])

    return ( 
        <div className="shadow-md rounded-2xl p-3 bg-white w-1/4 border border-altec-teal">
            <h2 className="text-xl font-semibold pt-1 mb-2 text-center">Testruimte systeem</h2>

            <hr className="border-b border-altec-teal mb-3" />

            <AutomationSpecs material="I00180" inktFolie="AR-10"/>

            <p className="text-xs font-semibold text-altec-teal uppercase tracking-wide mb-1">Sensor Type</p>
            <div className="flex flex-col gap-2 mb-4">
                <select
                    className="text-sm border border-altec-teal rounded-lg px-2 py-1.5 bg-altec-white focus:outline-none focus:ring-1 focus:ring-altec-teal"
                    name="sensor"
                    id="sensor"
                    value={sensor}
                    onChange={(e) => setSensor(e.target.value)}
                >
                    <option value="GAP">Gap</option>
                    <option value="MARK">Mark</option>
                    <option value="BOTH">Beide</option>
                </select>
            </div>

            <p className="text-xs font-semibold text-altec-teal uppercase tracking-wide mb-1">Print Quality</p>
            <div className="flex flex-col start gap-2 mb-4">
                <p className="text-xs">Speed:</p>
                <select
                    className="text-base border border-altec-teal rounded-lg px-2 py-1.5 bg-altec-white focus:outline-none focus:ring-1 focus:ring-altec-teal"
                    name="speed"
                    id="speed"
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                > 
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                </select>

                <p className="text-xs">Density:</p>
                <select
                    className="text-base border border-altec-teal rounded-lg px-2 py-1.5 bg-altec-white focus:outline-none focus:ring-1 focus:ring-altec-teal"
                    name="denisty"
                    id="denisty"
                    value={density}
                    onChange={(e) => setDensity(Number(e.target.value))}
                >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                    <option value="13">13</option>
                    <option value="14">14</option>
                    <option value="15">15</option>
                </select>
            </div>

            <p className="text-xs font-semibold text-altec-teal uppercase tracking-wide mb-1">Extra</p>
            <div className="flex flex-col gap-2 mb-4">
                <div className="flex flex-row">
                    <p className="text-sm mr-2">Cutter</p>
                    <input
                        className="accent-altec-teal w-4 h-4" 
                        type="checkbox"
                        id="cutter" 
                        name="cutter"
                        checked={cutter}
                        onChange={(e) => setCutter(e.target.checked)}
                    />
                </div>
                
                <div className="flex flex-row">
                    <p className="text-sm mr-2">Gebruiker label</p>
                    <input
                        className="accent-altec-teal w-4 h-4"
                        type="checkbox"
                        id="userLabel"
                        name="userLabel"
                        checked={userLabel}
                        onChange={(e) => setUserLabel(e.target.checked)}
                    />
                </div>
            </div>
            <p className="text-xs font-semibold text-altec-teal uppercase tracking-wide mb-1">Printer</p>

            {error && <p className="text-red-500">{error}</p>}

            <div className="flex flex-row gap-2 mb-4">
                <select
                    className="text-sm border border-altec-teal rounded-lg px-2 py-1.5 bg-altec-white focus:outline-none focus:ring-1 focus:ring-altec-teal"
                    name="printer"
                    id="printer"
                    value={printer}
                    onChange={(e) => setPrinter(e.target.value)}
                >
                    {printerList.map(printer => (
                        <option key={printer.name} value={printer.name}>{printer.name}</option>
                    ))}
                </select>
            </div>

            <button
                className="w-full border bg-altec-teal text-altec-white p-1.5 rounded-xl mt-2"
                onClick={sendPrint}
                disabled={!!error || loadingPrint}
            >
                {loadingPrint ? 'Loading...' : 'Print'}
            </button>
        </div>
    )
}
