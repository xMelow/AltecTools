import {useState} from "react"
import {getLabelPreview} from "../api/labels"
import {useFetch} from "../hooks/useFetch"

export default function TsplScreen() {
    const [labelTspl, setLabelTspl] = useState<string>("")
    const [showBlockOutline, setBlockOutline] = useState<boolean>(false)
    const [labelImages, setLabelImages] = useState<Record<string, string>>({})
    const {loading, error, result, execute} = useFetch<string>()

    async function handlePreview() {
        await execute(() => getLabelPreview({
            tspl: labelTspl,
            showBlockOutlines: showBlockOutline,
            images: labelImages
        }))
    }

    function handleImageImport(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files
        if (!files) return

        Array.from(files).forEach(file => {
            const reader = new FileReader()
            reader.onload = () => {
                const base64 = (reader.result as string).split(',')[1]
                setLabelImages(prev => ({
                    ...prev,
                    [file.name]: base64
                }))
            }
            reader.readAsDataURL(file)
        })
    }

    return (
        <div>
            <h2 className="text-center text-3xl font-bold text-altec-teal mb-4">Label Preview</h2>

            <div className="flex gap-4 items-start">

                {/* Settings panel */}
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
                            <label className="text-sm text-altec-teal border border-dashed border-altec-teal rounded-xl p-2 hover:bg-altec-light transition-colors cursor-pointer text-center block">
                                {Object.keys(labelImages).length > 0 ? Object.keys(labelImages).join(", ") : "+ Select image"}
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="hidden"
                                    onChange={(e) => handleImageImport(e)}
                                />
                            </label>
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

                    <textarea
                        className="flex-1 text-sm font-mono bg-altec-light rounded-xl p-3 resize-none focus:outline-none focus:ring-1 focus:ring-altec-teal"
                        value={labelTspl}
                        onChange={e => setLabelTspl(e.target.value)}
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
                            ? <img className="border border-altec-dark rounded-sm w-full" src={result} alt="Label preview" />
                            : <p className="text-xs text-gray-400">Preview will appear here...</p>
                        }
                    </div>
                </div>

            </div>
        </div>
    )
}
