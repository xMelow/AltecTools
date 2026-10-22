import { useRef, useState } from "react"
import { useFetch } from "../hooks/useFetch"
import { getLabelPreview, getNiceLabelLabelDetails } from "../api/nicelabel"
import { NiceLabelLabel } from "../types/nicelabel"

export default function NicelabelScreen() {
    const addLabelInputRef = useRef<HTMLInputElement>(null)
    const { result, loading, error, execute } = useFetch<NiceLabelLabel>()
    const { result: previewResult, loading: previewLoading, error: previewError, execute: previewExecute } = useFetch<string>()
    const [labelData, setLabelData] = useState<NiceLabelLabel>()
    const [labelPreviewBytes, setLabelPreviewBytes] = useState<string>()
    const [unit, setUnit] = useState<string>()

    async function handleLabelRequest(e: React.ChangeEvent<HTMLInputElement>) {
        let label = e.target.files?.item(0)

        if (!label) return

        const labelData = await execute(() => getNiceLabelLabelDetails(label))
        setLabelData(labelData)
        assignUnit(labelData?.labelSettings.dimensionUnit)

        const labelPreview = await previewExecute(() => getLabelPreview({
            file: label,
            width: 1000,
            height: 1000
        }))
        setLabelPreviewBytes(labelPreview)
    }

    function assignUnit(number: number | undefined) {
        switch (number) {
            case 1:
                setUnit("inch")
            case 2: 
                setUnit("mm")
            case 3:
                setUnit("cm")
            case 4:
                setUnit("dots")
            default:
                break;
        }
    }

    return (
        <div>
            <h1 className="text-center text-3xl font-bold text-altec-teal mb-3">NiceLabel</h1>

            <div className="w-1/2 center">
                <input
                    type="file"
                    accept="nlbl/*"
                    className="hidden"
                    ref={addLabelInputRef}
                    onChange={(e) => handleLabelRequest(e)}
                />
                <button
                    className="text-sm text-altec-teal border border-dashed border-altec-teal rounded-xl p-2 hover:bg-altec-light transition-colors w-full"
                    onClick={() => addLabelInputRef.current?.click()}
                >
                    + Select Label
                </button>
            </div>

            <div className="mt-5 flex items-start justify-between">
                <div className="shadow-md rounded-2xl p-3 bg-white w-1/4 border border-altec-teal">
                    <h2 className="text-xl font-semibold pt-1 mb-2 text-center">Label Information</h2>

                    <hr className="border-b border-altec-teal mb-3" />

                    <h3 className="font-bold">Variables</h3>
                    {labelData?.variables.map(el => (
                        <p>{el}</p>
                    ))}

                    <h3 className="mt-2 font-bold">Functions</h3>
                    {labelData?.functions.map(el => (
                        <p>{el}</p>
                    ))}

                    <h3 className="mt-2 font-bold">Label objects</h3>
                    {labelData?.labelObjects.map(el => (
                        <p>{el}</p>
                    ))}
                    
                    <h3 className="font-bold">Dataset</h3>
                    {labelData?.dataSets.map(el => (
                        <div>
                            <p>{el.customSql}</p>
                            <p>{el.isFileDatabase}</p>
                            <p>{el.fileDatabaseFileName}</p>
                            <p>{el.isCustomSql}</p>
                            <p>{el.tableName}</p>
                            <p className="font-bold">Fields</p>
                            {el.fields.map(f => (
                                <p>{f}</p>
                            ))}
                        </div>
                    ))}
                </div>

                <div className="shadow-md rounded-2xl p-3 bg-white w-1/4 border border-altec-teal">
                    <h2 className="text-xl font-semibold pt-1 mb-2 text-center">Label preview</h2>

                    <hr className="border-b border-altec-teal mb-3" />

                    {previewError && <p className="text-sm text-red-500">{previewError}</p>}
                        {labelPreviewBytes
                            ? <img 
                                className="border-2 border-altec-blue rounded-sm"
                                src={`data:image/png;base64,${labelPreviewBytes}`} 
                                alt="Label preview" 
                            />
                            : <p className="text-xs text-gray-400">Preview will appear here...</p>
                        }
                </div>

                <div className="shadow-md rounded-2xl p-3 bg-white w-1/4 border border-altec-teal">
                    <h2 className="text-xl font-semibold pt-1 mb-2 text-center">label settings</h2>

                    <hr className="border-b border-altec-teal mb-3" />

                    <h3 className="mt-2 font-bold">Settings</h3>
                    <div className="flex gap-2">
                        <p>Width: </p>
                        <p>{labelData?.labelSettings.width} {unit}</p>
                    </div>
                    <div className="flex gap-2">
                        <p>Height: </p>
                        <p>{labelData?.labelSettings.height} {unit}</p>
                    </div>
                    <div className="flex gap-2">
                        <p>Original printer: </p>
                        <p>{labelData?.labelSettings.originalPrinterName}</p>
                    </div>
                    <div className="flex gap-2">
                        <p>Original printer driver: </p>
                        <p>{labelData?.labelSettings.originalPrinterDriver}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
