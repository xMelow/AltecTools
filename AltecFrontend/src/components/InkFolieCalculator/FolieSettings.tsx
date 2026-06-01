
type FolieSettingsProps = {
    folieTotalLength: number,
    onFolieChange: (value: number) => void
}

export default function FolieSettings({ folieTotalLength, onFolieChange }: FolieSettingsProps) {
    return (
        <div className="bg-white shadow-2xl rounded-2xl p-4">
            <h2 className="text-2xl font-bold text-altec-dark">Inktfolie Instellingen</h2>
            <div className="mt-4 flex gap-4">
                <div className="">
                    <label className="text-1xl text-gray-500 font-medium">Inktfolie lengte (m)</label>
                    <select
                        className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-altec-teal"
                        value={folieTotalLength}
                        onChange={(e) => onFolieChange(Number(e.target.value))}>
                        <option value={300000}>300</option>
                        <option value={50000}>50</option>
                    </select>
                </div>
            </div>
        </div>
    )
}