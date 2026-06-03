import {useState} from "react";
import type {ClientOrder, Label, LabelOrder} from "../types/label";
import FolieSettings from "../components/InkFolieCalculator/FolieSettings";
import LabelList from "../components/InkFolieCalculator/LabelList";
import {calculateFolieAmount} from "../utils/inkFolieCaluculator";
import Results from "../components/InkFolieCalculator/Results";

let nextId = 0;

export default function InktFolieCalculatorScreen() {
    const [clientOrder, setClientOrder] = useState<ClientOrder>({
        foilLength: 300000,
        labelOrders: []
    })
    const result = calculateFolieAmount(clientOrder)

    function addClientOrder() {
        const newOrder: LabelOrder = {
            id: nextId,
            labelRollsOrdered: 1,
            label: {
                articleNumber: "Nieuw label",
                height: 0,
                width: 0,
                gap: 0,
                labelsPerRow: 1,
                totalLabels: 0,
            }
        }
        setClientOrder({...clientOrder, labelOrders: [newOrder, ...clientOrder.labelOrders] })
        nextId += 1;
    }

    function updateLabelValue(id: number, param: keyof Label | "labelRollsOrdered", value: number | string) {
        const updatedOrders = clientOrder.labelOrders.map(order => {
            if (order.id !== id) return order

            if (param === "labelRollsOrdered") {
                return { ...order, labelRollsOrdered: Number(value) }
            } else {
                return { ...order, label: { ...order.label, [param]: value}}
            }
        })
        setClientOrder({...clientOrder, labelOrders: updatedOrders})
    }

    function removeLabelOrder(labelOrder: LabelOrder) {
        const newOrderList = clientOrder.labelOrders.filter(l => l.id !== labelOrder.id)
        setClientOrder({...clientOrder, labelOrders: newOrderList})
    }

    return (
        <div className="min-h-screen bg-altec-light">

            <main className="max-w-5xl mx-auto px-6 py-8 flex flex-col gap-6">
                <Results
                    calculationResult={result}
                />

                <LabelList
                    labelOrders={clientOrder.labelOrders}
                    onValueChange={(id, param, value) => updateLabelValue(id, param, value)}
                    onAddButtonClicked={() => addClientOrder()}
                    onRemoveButtonClicked={(labelOrder) => removeLabelOrder(labelOrder)}
                />

                <FolieSettings
                    folieTotalLength={clientOrder.foilLength}
                    onFolieChange={(e) => setClientOrder({ ...clientOrder, foilLength: e})}
                />
            </main>
        </div>
    )
}