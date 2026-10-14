import { useRef } from "react"
import { useFetch } from "../hooks/useFetch"
import { getNiceLabelLabelDetails } from "../api/nicelabel"
import { NiceLabelLabel } from "../types/nicelabel"

export default function NicelabelScreen() {
    const addLabelInputRef = useRef<HTMLInputElement>(null)
    const { loading, error, execute } = useFetch<NiceLabelLabel>()

    async function handleLabelRequest(e: React.ChangeEvent<HTMLInputElement>) {
        let label = e.target.files?.item(0)

        if (!label) return

        const data = await execute(() => getNiceLabelLabelDetails(label))
        console.log(data)
    }

    return (
        <div>
            <h1 className="text-center text-3xl font-bold text-altec-teal mb-3">NiceLabel</h1>

            <div className="w-xl">
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

            <div className="mt-5 flex items-start gap-5">
                <div className="shadow-md rounded-2xl p-3 bg-white w-1/4 border border-altec-teal">
                    <h2 className="text-xl font-semibold pt-1 mb-2 text-center">Label variables</h2>

                    <hr className="border-b border-altec-teal mb-3" />

                </div>

                <div className="shadow-md rounded-2xl p-3 bg-white w-1/4 border border-altec-teal">
                    <h2 className="text-xl font-semibold pt-1 mb-2 text-center">printer settings</h2>

                    <hr className="border-b border-altec-teal mb-3" />
                </div>

                <div className="shadow-md rounded-2xl p-3 bg-white w-1/4 border border-altec-teal">
                    <h2 className="text-xl font-semibold pt-1 mb-2 text-center">label settings</h2>

                    <hr className="border-b border-altec-teal mb-3" />
                </div>
            </div>
            
        </div>
    )
}
