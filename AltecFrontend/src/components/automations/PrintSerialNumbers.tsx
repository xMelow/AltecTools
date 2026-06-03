import { useState } from "react"
import { previewSerialNumbers, printSerialNumbers } from "../../api/automation"
import { useFetch } from "../../hooks/useFetch";
import { SerialNumberRequest } from "../../types/automation";

export default function PrintSerialNumbers() {
    const [excelFile, setExcelFile] = useState<File | null>(null)
    const [printerType, setPrinterType] = useState<string>("ATP-300NL")
    const { loading, error, result, execute } = useFetch<string>()
    const { loading: previewLoading, error: previewError, result: labelPreviews, execute: executePreview } = useFetch<string[]>() 
 
    async function sendRequest() {
        if (excelFile == null) return

        await execute(() => printSerialNumbers({
            excelFile: excelFile,
            type: printerType
        }))
    }

    async function getLabelPreview(file: File, type: string) {
        await executePreview(() => previewSerialNumbers({
            excelFile: file,
            type: type,
        }))
    }
    
    return (
        <div className="shadow-md rounded-2xl p-3 bg-white w-1/4 border border-altec-teal">
            <h2 className="text-xl font-semibold pt-1 mb-2 text-center">Serie nummers nieuwe printers</h2>

            <hr className="border-b border-altec-teal mb-4" />

            

            <p className="text-xs font-semibold text-altec-teal uppercase tracking-wide mb-1">File</p>
            <div className="flex flex-col gap-2 mb-4">
                <label className="text-sm text-altec-teal border border-dashed border-altec-teal rounded-xl p-2 hover:bg-altec-light transition-colors cursor-pointer text-center">
                    {excelFile?.name ?? "+ Select excel"}
                    <input
                        type="file"
                        accept=".xlsx"
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files?.[0] ?? null
                            setExcelFile(file) 
                            if (file) getLabelPreview(file, printerType)
                        }}
                    />
                </label>
            </div>

            <p className="text-xs font-semibold text-altec-teal uppercase tracking-wide mb-1">Printer Type</p>
            <div className="flex flex-col gap-2 mb-4">
                <select
                    className="text-sm border border-altec-teal rounded-lg px-2 py-1.5 bg-altec-white focus:outline-none focus:ring-1 focus:ring-altec-teal"
                    name="type"
                    id="type"
                    onChange={(e) => {
                        const newType = e.target.value
                        setPrinterType(newType)
                        if (excelFile != null) getLabelPreview(excelFile!, newType)
                    }}
                >
                    <option value="ATP-300NL">ATP-300 Pro NL</option>
                    <option value="ATP-300BT">ATP-300 Pro BT</option>
                    <option value="ATP-600NL">ATP-600 Pro NL</option>
                    <option value="ATP-600BT">ATP-600 Pro BT</option>
                    <option value="ATP-3000">ATP-3000</option>
                </select>
            </div>

            <p className="text-xs font-semibold text-altec-teal uppercase tracking-wide mb-1">Label Preview</p>
            <div className="mb-4">
                {previewLoading && <p className="text-xs text-gray-400">Loading preview...</p>}
                {previewError && <p className="text-xs text-red-500">{previewError}</p>}
                {labelPreviews?.length ? (
                    labelPreviews.map((imageBase64, index) => (
                        <img key={index} className="border border-altec-dark rounded-sm w-full" src={"data:image/png;base64," + imageBase64} alt="Label preview" />
                    ))
                ) : (
                    !previewLoading && <p className="text-xs text-gray-400">Preview will appear here...</p>
                )}
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
