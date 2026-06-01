import type {Label, LabelOrder} from "../types/label.ts";
import LabelCard from "./LabelCard.tsx";

type LabelListProps = {
    labelOrders: LabelOrder[],
    onValueChange: (id: number, param: keyof Label | "labelRollsOrdered", value: number | string) => void,
    onAddButtonClicked: () => void,
    onRemoveButtonClicked: (labelOrder: LabelOrder) => void
}

export default function LabelList({labelOrders, onValueChange, onAddButtonClicked, onRemoveButtonClicked}: LabelListProps) {
    return (
        <div className="bg-white shadow-2xl rounded-2xl p-4">
            <h2 className="text-2xl font-bold mb-4">Labels</h2>
            <button
                className="w-full mb-4 py-2 border-2 border-dashed border-gray-300 rounded-xl text-altec-dark hover:border-altec-teal hover:text-altec-teal transition-colors"
                onClick={onAddButtonClicked}>+ Label toevoegen</button>

            {labelOrders.map((labelOrder) => (
                <LabelCard
                    key={labelOrder.id}
                    labelOrder={labelOrder}
                    onValueChange={onValueChange}
                    onRemoveButtonClick={() => onRemoveButtonClicked(labelOrder)}
                />
            ))}

        </div>
    )
}