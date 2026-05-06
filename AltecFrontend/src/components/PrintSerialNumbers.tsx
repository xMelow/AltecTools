import { useState } from "react"
import { printSerialNumbers } from "../api/nicelabel"
import { useFetch } from "../hooks/useFetch";
import { SerialNumberRequest } from "../types/nicelabel";

export default function PrintSerialNumbers() {
    const [excelFile, setExcelFile] = useState<File | null>(null)
    const [printerType, setPrinterType] = useState<string>("")
    const {loading, error, result, execute} = useFetch<SerialNumberRequest>()

    async function sendRequest() {
        if (excelFile == null) return

        await execute(() => printSerialNumbers({
            excelFile: excelFile,
            type: printerType
        }))
    }
    
    return (
        <div className="shadow-md rounded-2xl p-3 bg-white w-1/4">
            <h2 className="text-xl font-semibold pt-1 mb-2 text-center">Serie nummers nieuwe printers</h2>

            <hr className="border-b border-altec-teal mb-4" />

            {error && <p className="text-red-500">{error}</p>}

            <p className="text-xs font-semibold text-altec-teal uppercase tracking-wide mb-1">File</p>
            <div className="flex flex-col gap-2 mb-4">
                <label className="text-sm text-altec-teal border border-dashed border-altec-teal rounded-xl p-2 hover:bg-altec-light transition-colors cursor-pointer text-center">
                    {excelFile?.name ?? "+ Select excel"}
                    <input
                        type="file"
                        accept=".xlsx"
                        className="hidden"
                        onChange={(e) => setExcelFile(e.target.files?.[0] ?? null)}
                    />
                </label>
            </div>

            <p className="text-xs font-semibold text-altec-teal uppercase tracking-wide mb-1">Printer Type</p>
            <div className="flex flex-col gap-2 mb-4">
                <select
                    className="text-sm border border-altec-teal rounded-lg px-2 py-1.5 bg-altec-white focus:outline-none focus:ring-1 focus:ring-altec-teal"
                    name="type"
                    id="type"
                    onChange={(e) => setPrinterType(e.target.value)}
                >
                    <option value="ATP-300NL">ATP-300 Pro NL</option>
                    <option value="ATP-300BT">ATP-300 Pro BT</option>
                    <option value="ATP-600NL">ATP-600 Pro NL</option>
                    <option value="ATP-600BT">ATP-600 Pro BT</option>
                    <option value="ATP-3000">ATP-3000</option>
                </select>
            </div>

            <p className="text-xs font-semibold text-altec-teal uppercase tracking-wide mb-1">Label Preview</p>
            <div className="mb-4" />

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
