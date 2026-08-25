import { useState } from "react";
import AutomationSpecs from "./AutomationSpecs";
import { useFetch } from "../../hooks/useFetch";
import { printQlickPrintLicensie } from "../../api/automation";


export default function QlickPrintLicensie() {
    const [dataFile, setDataFile] = useState<File | null>(null)
    const { loading, error, result, execute } = useFetch<string>()

    async function sendRequest() {
        if (dataFile == null) return

        await execute(() => printQlickPrintLicensie({
            dataFile: dataFile
        }))
    }

    return (
        <div className="shadow-md rounded-2xl p-3 bg-white w-1/4 border border-altec-teal">
            <h2 className="text-xl font-semibold pt-1 mb-2 text-center">QlickPrint licensies</h2>

            <hr className="border-b border-altec-teal mb-3" />

            <AutomationSpecs material="tags" inktFolie="AWH-20" printer="Altec ATP-300 Pro" />

            <p className="text-xs font-semibold text-altec-teal uppercase tracking-wide mb-1">File</p>
            <div className="flex flex-col gap-2 mb-4">
                <label className="text-sm text-altec-teal border border-dashed border-altec-teal rounded-xl p-2 hover:bg-altec-light transition-colors cursor-pointer text-center">
                    {dataFile?.name ?? "+ Select txt file"}
                    <input
                        type="file"
                        accept=".txt"
                        className="hidden"
                        onChange={(e) => {
                            setDataFile(e.target.files?.[0] ?? null)
                        }}
                    />
                </label>
            </div>

            {error && <p className="text-red-500">{error}</p>}
            {result && <p className="text-green-500">{result}</p>}

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
