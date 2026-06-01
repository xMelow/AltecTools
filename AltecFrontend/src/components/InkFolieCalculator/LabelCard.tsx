import type {Label, LabelOrder} from "../types/label.ts";

type LabelCardProps = {
    labelOrder: LabelOrder,
    onValueChange: (id: number, param: keyof Label | "labelRollsOrdered", value: number | string) => void
    onRemoveButtonClick: () => void
}

export default function LabelCard({labelOrder, onValueChange, onRemoveButtonClick}: LabelCardProps) {
    return (
        <div className="bg-white border border-altec-teal rounded-2xl p-4 mb-3">
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-xl text-altec-dark">
                    {labelOrder.label.articleNumber || "Nieuw Label"}
                </h2>
                <button className="p-2 border-altec-light-blue bg-altec-light-blue border-2 rounded-2xl hover:bg-altec-teal hover:text-white"
                        onClick={onRemoveButtonClick}>Verwijder</button>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1 mt-4">
                    <label className="input-label">Artikelnummer</label>
                    <input
                        className="input-field"
                        type={"text"}
                        value={labelOrder.label.articleNumber === "Nieuw label" ? "" : labelOrder.label.articleNumber}
                        onChange={(e) => onValueChange(labelOrder.id, "articleNumber", e.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-1 mt-4">
                    <label className="input-label">Label hoogte (mm)</label>
                    <input
                        className="input-field"
                        type={"number"}
                        value={labelOrder.label.height === 0 ? "" : labelOrder.label.height}
                        onChange={(e) => onValueChange(labelOrder.id, "height", Number(e.target.value))}
                    />
                </div>

                <div className="flex flex-col gap-1 mt-4">
                    <label className="input-label">Tussenruimte (mm)</label>
                    <input
                        className="input-field"
                        type={"number"}
                        value={labelOrder.label.gap === 0 ? "" : labelOrder.label.gap}
                        onChange={(e) => onValueChange(labelOrder.id, "gap", Number(e.target.value))}
                    />
                </div>

                <div className="flex flex-col gap-1 mt-4">
                    <label className="input-label">Labels per rij</label>
                    <input
                        className="input-field"
                        type={"number"}
                        value={labelOrder.label.labelsPerRow === 0 ? "" : labelOrder.label.labelsPerRow}
                        onChange={(e) => onValueChange(labelOrder.id, "labelsPerRow",Number(e.target.value))}
                    />
                </div>

                <div className="flex flex-col gap-1 mt-4">
                    <label className="input-label">Totaal aantal labels per rol</label>
                    <input
                        className="input-field"
                        type={"number"}
                        value={labelOrder.label.totalLabels === 0 ? "" : labelOrder.label.totalLabels}
                        onChange={(e) => onValueChange(labelOrder.id, "totalLabels", Number(e.target.value))}
                    />
                </div>

                <div className="flex flex-col gap-1 mt-4">
                    <label className="input-label">Rollen besteld</label>
                    <input
                        className="input-field"
                        type={"number"}
                        value={labelOrder.labelRollsOrdered === 0 ? "" : labelOrder.labelRollsOrdered}
                        onChange={(e) => onValueChange(labelOrder.id, "labelRollsOrdered", Number(e.target.value))}
                    />
                </div>
            </div>
        </div>
    )
}
