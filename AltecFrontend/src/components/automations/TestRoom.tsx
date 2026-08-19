import { useState } from "react"
import AutomationSpecs from "./AutomationSpecs"
import { useFetch } from "../../hooks/useFetch"

export default function TestRoom() {
    const [sensor, setSensor] = useState<string>("Gap")
    const [speed, setSpeed] = useState<number>(2)
    const [density, setDensity] = useState<number>(8)
    const [printer, setPrinter] = useState<string>()
    const [cutter, setCutter] = useState<boolean>(false)
    const [userLabel, setUserLabel] = useState<boolean>(false)
    const { loading, error, result, execute } = useFetch<string>()
    
    function sendPrint() {

    }

    function getPrinters() {        
        
    }

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
            <div className="flex flex-row items-center gap-2 mb-4">
                <p className="text-xs mb-1">Speed:</p>
                <select
                    className="text-sm border border-altec-teal rounded-lg px-2 py-1.5 bg-altec-white focus:outline-none focus:ring-1 focus:ring-altec-teal"
                    name="speed"
                    id="speed"
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                >
                    <option value="1.5">1.5</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                </select>

                <p className="text-xs mb-1">Density:</p>
                <select
                    className="text-sm border border-altec-teal rounded-lg px-2 py-1.5 bg-altec-white focus:outline-none focus:ring-1 focus:ring-altec-teal"
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
            <div className="flex flex-row items-center gap-2 mb-4">
                <p className="text-xs mb-1">Cutter</p>
                <input 
                    className="" 
                    type="checkbox"
                    id="cutter" 
                    name="cutter"
                    checked={cutter}
                    onChange={(e) => setCutter(e.target.checked)}
                />
                <p className="text-xs mb-1">Gebruiker label</p>
                <input 
                    className="text-sm border border-altec-teal rounded-lg px-2 py-1.5 bg-altec-white focus:outline-none focus:ring-1 focus:ring-altec-teal" 
                    type="checkbox"
                    id="userLabel" 
                    name="userLabel"
                    checked={userLabel}
                    onChange={(e) => setUserLabel(e.target.checked)}
                />
            </div>
                
            <p className="text-xs font-semibold text-altec-teal uppercase tracking-wide mb-1">Printer</p>
            <div className="flex flex-row gap-2 mb-4">
                <select
                    className="text-sm border border-altec-teal rounded-lg px-2 py-1.5 bg-altec-white focus:outline-none focus:ring-1 focus:ring-altec-teal"
                    name="printer"
                    id="printer"
                    value={printer}
                    onChange={(e) => setPrinter(e.target.value)}
                >
                    <option value="ATP">ATP 300 Pro</option>
                </select>
            </div>

            <button
                className="w-full border bg-altec-teal text-altec-white p-1.5 rounded-xl mt-2"
                onClick={sendPrint}
                disabled={loading}
            >
                {loading ? 'Loading...' : 'Print'}
            </button>
        </div>
    )
}