
type AutomationSpecsProps = {
    material: string
    inktFolie: string
    printer: string
}

export default function AutomationSpecs({ material, inktFolie, printer }: AutomationSpecsProps) {

    return (
        <div className="mb-3">
            <p className="text-xs font-semibold text-altec-teal uppercase tracking-wide mb-2">Material</p>
            <div className="flex">
                <p
                    className="mr-2 text-sm border border-altec-teal text-altec-teal px-2 py-0.5 rounded-lg transition-colors disabled:opacity-50"
                >
                    {material}
                </p>

                <p
                    className="mr-2 text-sm border border-altec-teal text-altec-teal px-2 py-0.5 rounded-lg transition-colors disabled:opacity-50"
                >
                    {inktFolie}
                </p>
                <p
                    className="mr-2 text-sm border border-altec-teal text-altec-teal px-2 py-0.5 rounded-lg transition-colors disabled:opacity-50"
                >
                    {printer}
                </p>
            </div>
            
        </div>
    )
}