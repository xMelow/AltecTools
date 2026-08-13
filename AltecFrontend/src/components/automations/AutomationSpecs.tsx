type AutomationSpecsProps = {
    material?: string
    inktFolie?: string
    printer: string
}

export default function AutomationSpecs({ material, inktFolie, printer }: AutomationSpecsProps) {

    const specs = [
        { label: "Material", value: material },
        { label: "Inktfolie", value: inktFolie },
        { label: "Printer", value: printer },
    ].filter(spec => spec.value)

    return (
        <div className="mb-3">
            <p className="text-xs font-semibold text-altec-teal uppercase tracking-wide mb-2">Specifications</p>
            <div className="flex flex-wrap">
                {specs.map(spec => (
                    <div 
                        key={spec.label}
                    >
                        <p
                            className="mr-2 mb-2 text-center text-sm border border-altec-teal bg-altec-teal text-altec-white px-2 py-0.5 rounded-lg"
                        >
                            {spec.label}
                        </p>
                        <p
                            className="mr-2 text-sm text-center border border-altec-teal text-altec-teal px-2 py-0.5 rounded-lg"
                        >
                            {spec.value}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}
