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
        <div className="border border-altec-teal py-2 rounded-xl p-2 bg-altec-white w-1/4">
            <h2 className="text-xl font-semibold pt-2 mb-2">Serie nummers nieuwe printers</h2>

            <hr className="border-b border-altec-teal mb-4" />

            {error && <p className="text-red-500">{error}</p>}

            <div className="flex flex-col gap-2">
                <label
                    className=" w-27 cursor-pointer bg-altec-teal text-white px-3 py-1.5 rounded-xl"
                    htmlFor="excelFile"
                >
                    Select excel
                </label>

                <input
                    id="excelFile"
                    type="file"
                    accept={".xlsx"}
                    multiple
                    className="hidden"
                    onChange={(e) => setExcelFile(e.target.files?.[0] ?? null)}
                />

                <p>{excelFile?.name}</p>
            </div>

            <div className="flex gap-2">
                <label htmlFor="type">Printer Type:</label>
                <select className="" name="type" id="type" onChange={(e) =>setPrinterType(e.target.value)} >
                    <option value="ATP-300NL">ATP-300 Pro NL</option>
                    <option value="ATP-300BT">ATP-300 Pro BT</option>
                    <option value="ATP-600NL">ATP-600 Pro NL</option>
                    <option value="ATP-600BT">ATP-600 Pro BT</option>
                    <option value="ATP-3000">ATP-3000</option>
                </select>
            </div>

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
