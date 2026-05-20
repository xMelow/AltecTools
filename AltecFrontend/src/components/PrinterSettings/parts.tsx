export function SettingRow({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="flex justify-between items-center py-1.5 border-b border-altec-light last:border-0">
            <span className="text-gray-500 text-sm">{label}</span>
            <span className="font-medium text-sm text-right ml-4">{value}</span>
        </div>
    )
}

export function EditableRow({ label, value, onChange, unit }: { label: string; value: string; unit?: string; onChange: (v: string) => void }) {
    return (
        <div className="flex justify-between items-center py-1.5 border-b border-altec-light last:border-0">
            <span className="text-gray-500 text-sm shrink-0">{label}</span>
            <input
                className="font-medium text-sm text-right ml-4 border border-altec-light rounded px-1.5 py-0.5 w-28 focus:outline-none focus:border-altec-teal bg-altec-light"
                value={value}
                onChange={e => onChange(e.target.value)}
            />
            <span>{unit}</span>
        </div>
    )
}

export function SelectRow({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
    return (
        <div className="flex justify-between items-center py-1.5 border-b border-altec-light last:border-0">
            <span className="text-gray-500 text-sm shrink-0">{label}</span>
            <select
                className="font-medium text-sm text-right ml-4 border border-altec-light rounded px-1.5 py-0.5 w-28 focus:outline-none focus:border-altec-teal bg-altec-light"
                value={value}
                onChange={e => onChange(e.target.value)}
            >
                {options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
        </div>
    )
}

export function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="mb-4">
            <p className="sticky top-0 z-10 bg-altec-white text-xs font-semibold text-altec-teal uppercase tracking-wide py-1 mb-1">{title}</p>
            <div className="flex flex-col">
                {children}
            </div>
        </div>
    )
}
