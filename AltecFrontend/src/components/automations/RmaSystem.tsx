import { useState } from "react";
import AutomationSpecs from "./AutomationSpecs";
import { useFetch } from "../../hooks/useFetch";

const MODEL_OPTIONS = [
    "--",
    "3100S",
    "384M",
    "Altec-O-Matic",
    "ALTM5280-2D DRAADLOZE SCANNER",
    "AMP-300BT",
    "AMP-300W",
    "ATP-23",
    "ATP-300",
    "ATP-300PRO",
    "ATP-600 Pro",
    "ATP3000",
    "ATP4310E",
    "ATP600",
    "ATP8300E",
    "ATP8310E",
    "ATP BATTERYPACK 24000mAh",
    "ATPX",
    "ATPX 300",
    "BBP 35",
    "BBP11",
    "BBP12",
    "BBP31",
    "BBP33",
    "BBP37",
    "BBP85",
    "BMP 21",
    "BMP 41",
    "BMP 61",
    "BMP 71",
    "BMP41",
    "BMP51",
    "BP-IP",
    "BP-IP300",
    "BP-PR 300 PLUS",
    "Cab XC6",
    "CL-1",
    "CLP500",
    "ColorCube",
    "Cutter ATP-300Pro",
    "GlobalMark",
    "GlobalMark 2 Color&Cut",
    "I7100",
    "ICP 400",
    "ICP-300 300DPI",
    "ICP410",
    "LASSIE 2",
    "LASSIE 2E",
    "LASSIE 2PLUS",
    "Lassie TT",
    "M210",
    "M410",
    "M510",
    "M610",
    "M611",
    "M710",
    "MAG-200",
    "MAGELLAN 1500i 2D USB",
    "Magellan 1500i",
    "MB340T",
    "MiniMark",
    "P-Touch7600",
    "PrintPad",
    "QuickScan QD2131",
    "S3000",
    "S3100",
    "SCANNER GM4400 2D + RS232",
    "SCANNER MAGELLAN 1500i 2D USB",
    "Scanner ALTD-4520",
    "TC-200",
    "TLS 2200",
    "TTP 200",
    "TTP 200E",
    "TTP 300",
    "TTP 300E",
    "TTP-3346M",
    "XTL300",
    "Z4M - 200DPI",
    "Z4M - 300DPI",
    "ZC300",
    "ZC350",
    "ZM400",
    "ZT230",
    "ZT410 - 200DPI",
    "ZT411",
    "Zebra TLP3842",
    "Zebra ZXP3",
    "Zebra ZXP7",
]

const DONT_SEND_OPTIONS = [
    "Printer",
    "Voedingsadapter",
    "Batterij",
    "Stroomkabel",
    "Labels",
    "Inkt folie",
    "Inkt cartridge",
    "Toetsenboard",
]

export default function RmaSystem() {
    const [language, setLanguage] = useState<string>("Nederlands")
    const [ticketNumber, setTicketNumber] = useState<number>()
    const [company, setCompany] = useState<string>("")
    const [contactPerson, setContactPerson] = useState<string>("")
    const [contactPersonPrefix, setContactPersonPrefix] = useState<string>("Mr")
    const [email, setEmail] = useState<string>("")
    const [street, setStreet] = useState<string>("")
    const [place, setPlace] = useState<string>("")
    const [model, setModel] = useState<string>("ATP-300PRO")
    const [serienummer, setSerienummer] = useState<number>()
    const [warrenty, setWarrenty] = useState<string>("Warranty")
    const [problem1, setProblem1] = useState<string>("")
    const [problem2, setProblem2] = useState<string>("")
    const [dontSendItems, setDontSendItems] = useState<string[]>([])
    const { loading: loadingPdf, error: errorPdf, result: resultPdf, execute: executePdf } = useFetch<string>()
    const { loading: loadingEmail, error: errorEmail, result: resultEmail, execute: executeEmail } = useFetch<string>()
    
    function toggleDontSendItem(item: string) {
        if (dontSendItems.includes(item)) {
            setDontSendItems(dontSendItems.filter(el => el !== item))
        } 
        else {
            setDontSendItems([...dontSendItems, item])
        }
    }

    function createPdf() {

    }

    function sendEmail() {

    }

    return (
        <div className="shadow-md rounded-2xl p-3 bg-white w-1/4 border border-altec-teal">
            <h2 className="text-xl font-semibold pt-1 mb-2 text-center">RMA systeem</h2>
            <hr className="border-b border-altec-teal mb-3" />
            
            <AutomationSpecs material="PDF" />

            <p className="text-xs font-semibold text-altec-teal uppercase tracking-wide mb-1">Taal</p>
            <div className="flex flex-col gap-2 mb-4">
                <select
                    className="text-sm border border-altec-teal rounded-lg px-2 py-1.5 bg-altec-white focus:outline-none focus:ring-1 focus:ring-altec-teal"
                    name="language"
                    id="language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value) }
                >
                    <option value="NL">Nederlands</option>
                    <option value="EN">Engels</option>
                    <option value="FR">Frans</option>
                </select>

                <label className="text-xs font-semibold text-altec-teal uppercase tracking-wide">Ticket nummer</label>
                <input 
                    className="text-sm border border-altec-teal rounded-lg px-2 py-1.5 bg-altec-white focus:outline-none focus:ring-1 focus:ring-altec-teal" 
                    type="number"
                    id="ticketNumber" 
                    name="ticketNumber"
                    value={ticketNumber}
                    onChange={(e) => setTicketNumber(Number(e.target.value)) }
                />

                <label className="text-xs font-semibold text-altec-teal uppercase tracking-wide">Bedrijf</label>
                <input 
                    className="text-sm border border-altec-teal rounded-lg px-2 py-1.5 bg-altec-white focus:outline-none focus:ring-1 focus:ring-altec-teal" 
                    type="text"
                    id="company" 
                    name="company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value) }
                />

                <div>
                    <p className="text-xs font-semibold text-altec-teal uppercase tracking-wide mb-1">Contact persoon</p>
                    <select
                        className="mr-2 text-sm border border-altec-teal rounded-lg px-2 py-1.5 bg-altec-white focus:outline-none focus:ring-1 focus:ring-altec-teal"
                        name="contactPersonPrefix"
                        id="contactPersonPrefix"
                        value={contactPersonPrefix}
                        onChange={(e) => setContactPersonPrefix(e.target.value) }
                    >
                        <option value="Mr">Mr</option>
                        <option value="Madam">Madam</option>
                    </select>
                    <input 
                        className="text-sm border border-altec-teal rounded-lg px-2 py-1.5 bg-altec-white focus:outline-none focus:ring-1 focus:ring-altec-teal" 
                        type="text"
                        id="contactPerson" 
                        name="contactPerson"
                        value={contactPerson}
                        onChange={(e) => setContactPerson(e.target.value) }
                    />
                </div>

                <p className="text-xs font-semibold text-altec-teal uppercase tracking-wide">Email</p>
                <input 
                    className="text-sm border border-altec-teal rounded-lg px-2 py-1.5 bg-altec-white focus:outline-none focus:ring-1 focus:ring-altec-teal" 
                    type="text"
                    id="email" 
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value) }
                />

                <p className="text-xs font-semibold text-altec-teal uppercase tracking-wide">Straat</p>
                <input 
                    className="text-sm border border-altec-teal rounded-lg px-2 py-1.5 bg-altec-white focus:outline-none focus:ring-1 focus:ring-altec-teal" 
                    type="text"
                    id="street" 
                    name="street"
                    value={street}
                    onChange={(e) => setStreet(e.target.value) }
                />

                <p className="text-xs font-semibold text-altec-teal uppercase tracking-wide">Plaats</p>
                <input 
                    className="text-sm border border-altec-teal rounded-lg px-2 py-1.5 bg-altec-white focus:outline-none focus:ring-1 focus:ring-altec-teal" 
                    type="text"
                    id="place" 
                    name="place"
                    value={place}
                    onChange={(e) => setPlace(e.target.value) } 
                />

                <p className="text-xs font-semibold text-altec-teal uppercase tracking-wide">Model</p>
                <select
                    className="mr-2 text-sm border border-altec-teal rounded-lg px-2 py-1.5 bg-altec-white focus:outline-none focus:ring-1 focus:ring-altec-teal"
                    name="model"
                    id="model"
                    value={model}
                    onChange={(e) => setModel(e.target.value) }
                >
                    {MODEL_OPTIONS.map((modelOption) => (
                        <option key={modelOption} value={modelOption}>{modelOption}</option>
                    ))}
                </select>

                <p className="text-xs font-semibold text-altec-teal uppercase tracking-wide">Serienummer</p>
                <input 
                    className="text-sm border border-altec-teal rounded-lg px-2 py-1.5 bg-altec-white focus:outline-none focus:ring-1 focus:ring-altec-teal" 
                    type="number"
                    id="serienummer" 
                    name="serienummer"
                    value={serienummer}
                    onChange={(e) => setSerienummer(Number(e.target.value)) }
                />

                <p className="text-xs font-semibold text-altec-teal uppercase tracking-wide">Warrenty</p>
                <select
                    className="mr-2 text-sm border border-altec-teal rounded-lg px-2 py-1.5 bg-altec-white focus:outline-none focus:ring-1 focus:ring-altec-teal"
                    name="warrenty"
                    id="warrenty"
                    value={warrenty}
                    onChange={(e) => setWarrenty(e.target.value) }
                >
                    <option value="Warranty">Warranty</option>
                    <option value="Out of warranty">Out of warranty</option>
                    <option value="In evaluation">In evaluation</option>
                </select>

                <p className="text-xs font-semibold text-altec-teal uppercase tracking-wide">Probleem 1</p>
                <input
                    className="text-sm border border-altec-teal rounded-lg px-2 py-1.5 bg-altec-white focus:outline-none focus:ring-1 focus:ring-altec-teal" 
                    type="text"
                    id="problem1"
                    name="problem1"
                    value={problem1}
                    onChange={(e) => setProblem1(e.target.value) }
                />

                <p className="text-xs font-semibold text-altec-teal uppercase tracking-wide">Probleem 2</p>
                <input 
                    className="text-sm border border-altec-teal rounded-lg px-2 py-1.5 bg-altec-white focus:outline-none focus:ring-1 focus:ring-altec-teal" 
                    type="text"
                    id="problem2"
                    name="problem2"
                    value={problem2}
                    onChange={(e) => setProblem2(e.target.value) }
                />

                <p className="text-xs font-semibold text-altec-teal uppercase tracking-wide">Niet mee sturen</p>
                <div className="flex flex-wrap gap-2 mb-2">
                    {DONT_SEND_OPTIONS.map((option) => {
                        const isSelected = dontSendItems.includes(option)
                        return (
                            <button
                                key={option}
                                type="button"
                                className={`text-sm px-2 py-1.5 rounded-lg border border-altec-teal focus:outline-none focus:ring-1 focus:ring-altec-teal ${
                                    isSelected ? "bg-altec-teal text-altec-white" : "bg-altec-white"
                                }`}
                                onClick={() => toggleDontSendItem(option)}
                            >
                                {option}
                            </button>
                        )
                    })}
                </div>

                <div className="flex flex-row gap-2">
                    <button
                        className="w-full border bg-altec-teal text-altec-white p-1.5 rounded-xl mt-2"
                        onClick={createPdf}
                        disabled={loadingPdf}
                    >
                        {loadingPdf ? 'Loading...' : 'PDF'}
                    </button>
                    <button
                        className="w-full border bg-altec-teal text-altec-white p-1.5 rounded-xl mt-2"
                        onClick={sendEmail}
                        disabled={loadingEmail}
                    >
                        {loadingEmail ? 'Loading...' : 'Email'}
                    </button>
                </div>
            </div>
        </div>
    )
}
