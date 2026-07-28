import {useRef, useState} from "react"
import {getLabelPreview} from "../api/labels"
import {useFetch} from "../hooks/useFetch"
import CodeEditorField from "../components/CodeEditorField"

export default function TsplScreen() {
    const [labelTspl, setLabelTspl] = useState<string>("")
    const [showBlockOutline, setBlockOutline] = useState<boolean>(false)
    const [labelImages, setLabelImages] = useState<Record<string, string>>({})
    const {loading, error, result, execute} = useFetch<string>()
    const addImageInputRef = useRef<HTMLInputElement>(null)

    async function handlePreview() {
        await execute(() => getLabelPreview({
            tspl: labelTspl,
            showBlockOutlines: showBlockOutline,
            images: labelImages
        }))
    }

    function removeImage(fileName: string) {
        setLabelImages(prev => {
            const { [fileName]: _, ...rest } = prev
            return rest
        })
    }

    function handleImageImport(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files
        if (!files) return

        Array.from(files).forEach(file => {
            const reader = new FileReader()
            reader.onload = () => {
                const base64 = (reader.result as string).split(',')[1]
                let newFileName = ""
                let fileIndex = file.name.lastIndexOf(".")
                
                if (fileIndex != -1) {
                    const fileName = file.name.slice(0, fileIndex)
                    const fileExtension = file.name.slice(fileIndex+1)
                    newFileName = fileName + "." + fileExtension.toUpperCase()
                } else {
                    newFileName = file.name
                }
                
                setLabelImages(prev => ({
                    ...prev,
                    [newFileName]: base64
                }))
            }
            reader.readAsDataURL(file)
        })
    }

    return (
        <div>
            <h2 className="text-center text-3xl font-bold text-altec-teal mb-4">TSPL Preview</h2>

            <div className="flex gap-4 items-start">

                <div className="w-1/5 flex flex-col border rounded-2xl border-altec-teal bg-altec-white max-h-[75vh]">
                    <div className="px-4 pt-4 shrink-0">
                        <h3 className="text-lg font-semibold mb-2">Settings</h3>
                        <hr className="border-b border-altec-teal mb-3" />
                    </div>

                    <div className="overflow-y-auto px-4 pb-4 grow flex flex-col gap-4">
                        <div>
                            <p className="text-xs font-semibold text-altec-teal uppercase tracking-wide mb-2">Display</p>
                            <div className="flex items-center justify-between">
                                <label htmlFor="showBlockOutline" className="text-sm text-gray-600">Block outline</label>
                                <input
                                    type="checkbox"
                                    name="showBlockOutline"
                                    id="showBlockOutline"
                                    onChange={e => setBlockOutline(e.target.checked)}
                                />
                            </div>
                        </div>

                        <div>
                            <p className="text-xs font-semibold text-altec-teal uppercase tracking-wide mb-2">Images</p>

                            <div className="flex flex-col gap-2 mb-2">
                                {Object.keys(labelImages).map(fileName => (
                                    <div key={fileName} className="flex items-center justify-between border border-altec-teal/40 rounded-xl p-2">
                                        <span className="text-sm truncate">{fileName}</span>
                                        <button
                                            className="text-xs text-gray-400 hover:text-red-400 transition-colors ml-2 shrink-0"
                                            onClick={() => removeImage(fileName)}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                ref={addImageInputRef}
                                onChange={(e) => handleImageImport(e)}
                            />
                            <button
                                className="text-sm text-altec-teal border border-dashed border-altec-teal rounded-xl p-2 hover:bg-altec-light transition-colors w-full"
                                onClick={() => addImageInputRef.current?.click()}
                            >
                                + Select image
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col border rounded-2xl border-altec-teal bg-altec-white p-4 h-[75vh]">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold">TSPL Code</h3>
                        <button
                            className="border bg-altec-teal text-altec-white px-4 py-1 rounded-xl text-sm disabled:opacity-50"
                            onClick={handlePreview}
                            disabled={loading}
                        >
                            {loading ? "Loading..." : "Preview"}
                        </button>
                    </div>
                    <hr className="border-b border-altec-teal mb-3" />

                    <CodeEditorField
                        className="flex-1 min-h-0 text-sm font-mono bg-altec-light rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-altec-teal"
                        height="100%"
                        value={labelTspl}
                        onChange={setLabelTspl}
                        placeholder="Enter TSPL code..."
                    />
                </div>

                <div className="w-1/4 flex flex-col border rounded-2xl border-altec-teal bg-altec-white max-h-[75vh]">
                    <div className="px-4 pt-4 shrink-0">
                        <h3 className="text-lg font-semibold mb-2">Label Preview</h3>
                        <hr className="border-b border-altec-teal mb-3" />
                    </div>

                    <div className="overflow-y-auto px-4 pb-4 grow">
                        {error && <p className="text-sm text-red-500">{error}</p>}
                        {result
                            ? <img className="border-2 border-altec-blue rounded-sm w-full" src={result} alt="Label preview" />
                            : <p className="text-xs text-gray-400">Preview will appear here...</p>
                        }
                    </div>
                </div>

            </div>
        </div>
    )
}
