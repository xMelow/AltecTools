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
        <div className="">
            <h2 className="text-center text-3xl font-bold text-altec-teal mb-3">Label Preview</h2>

            <div className="flex justify-around">
                <div className="w-1/4 h-1/4 pl-5 pb-5 pr-5 flex flex-col border rounded-2xl border-altec-teal bg-altec-white justify-center">
                    <h2 className="text-xl font-semibold pt-2 mb-2">TSPL Code</h2>

                    <hr className="border-b border-altec-teal mb-4" />

                  <textarea
                      className="text-sm  bg-altec-white p-2 h-1/10"
                      value={labelTspl}
                      onChange={e => setLabelTspl(e.target.value)}
                      placeholder="Enter TSPL code..."
                      rows={25}
                  />
                </div>

                <div className="w-1/4 h-1/4 pl-5 pb-5 pr-5 flex flex-col border rounded-2xl border-altec-teal bg-altec-white justify-center">
                    <h2 className="text-xl font-semibold pt-2 mb-2">Settings</h2>

                    <hr className="border-b border-altec-teal mb-4" />

                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <label
                                htmlFor="showBlockOutline"
                            >
                                Show block outline
                            </label>
                            <input
                                className=""
                                type="checkbox"
                                name="showBlockOutline"
                                id="showBlockOutline"
                                onChange={e => setBlockOutline(e.target.checked)}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label
                                className=" w-29 cursor-pointer bg-altec-teal text-white px-3 py-1.5 rounded-xl"
                                htmlFor="labelImages"
                            >
                                Select image
                            </label>
                            <input
                                id="labelImages"
                                type="file"
                                accept={"image/*"}
                                multiple
                                className="hidden"
                                onChange={(e) => handleImageImport(e)}
                            />
                            {Object.keys(labelImages).map(key => (
                                    <p className="text-sm text-altec-dark" key={key}>{key}</p>
                                )
                            )}
                        </div>

                    </div>
                    <button
                        className="border bg-altec-teal text-altec-white p-1.5 rounded-xl mt-2"
                        onClick={handlePreview}
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : 'Preview'}
                    </button>
                </div>

                <div className="w-1/4 h-1/4 pl-5 pb-5 pr-5 flex flex-col border rounded-2xl border-altec-teal bg-altec-white justify-center">
                    <h2 className="text-xl font-semibold pt-2 mb-2">Label Preview</h2>

                    <hr className="border-b border-altec-teal mb-4" />

                    {result
                        ? <img
                            className="border border-altec-dark rounded-sm"
                            src={result}
                            alt="Label preview"
                        />
                        : <p className=""></p>
                    }
                    {error && <p className="text-red-500">{error}</p>}
                </div>
            </div>
        </div>
    )
}
