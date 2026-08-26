import { useState } from "react";
import AutomationSpecs from "./AutomationSpecs";

export default function RmaSystem() {
    const [language, setLanguage] = useState<string>("Nederlands")
    const [ticketNumber, setTicketNumber] = useState<number>()

    return (
        <div className="shadow-md rounded-2xl p-3 bg-white w-1/4 border border-altec-teal">
            <h2 className="text-xl font-semibold pt-1 mb-2 text-center">RMA systeem</h2>
            <hr className="border-b border-altec-teal mb-3" />
            
            <AutomationSpecs material="A4" />

            <p className="text-xs font-semibold text-altec-teal uppercase tracking-wide mb-1">Taal</p>
            <div className="flex flex-col gap-2 mb-4">
                <select
                    className="text-sm border border-altec-teal rounded-lg px-2 py-1.5 bg-altec-white focus:outline-none focus:ring-1 focus:ring-altec-teal"
                    name="sensor"
                    id="sensor"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                >
                    <option value="NL">Nederlands</option>
                    <option value="EN">Engels</option>
                    <option value="FR">Frans</option>
                </select>

                <label className="text-xs font-semibold text-altec-teal uppercase tracking-wide mb-1">Order nummer</label>
                <input 
                    className="text-sm border border-altec-teal rounded-lg px-2 py-1.5 bg-altec-white focus:outline-none focus:ring-1 focus:ring-altec-teal" 
                    type="number"
                    id="ticketNumber" 
                    name="ticketNumber"
                    value={ticketNumber}
                    onChange={(e) => { setTicketNumber(Number(e.target.value)) }} 
                />

                {/* bedrijf input field */}

                {/* contact persoon input field + select with Mr of Madam of -- */}

                {/* email input field */}

                {/* straat input field */}

                {/* plaats input field */}

                {/* model select field */}

                {/* serienummer input field */}

                {/* warrenty select field */}

                {/* probleem 1 input field */}

                {/* probleem 2 input field */}

            </div>
        </div>
    )
}
