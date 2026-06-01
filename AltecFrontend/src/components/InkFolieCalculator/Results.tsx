import type {CalculationResult} from "../types/label.ts";
import LabelBreakdownTable from "./LabelBreakDownTable.tsx";

type ResultsProps = {
    calculationResult: CalculationResult
}

export default function Results({ calculationResult }: ResultsProps) {
    if (calculationResult.foilRollsNeeded === 0) {
        return (
            <div className="bg-white shadow-2xl rounded-2xl p-4">
                <h2 className="text-2xl font-bold mb-4">Resultaat</h2>
                <p>Voeg label toe om resultaten te weergeven.</p>
            </div>
        )
    }

    return (
        <div className="bg-white shadow-2xl rounded-2xl p-4">
            <h2 className="text-2xl font-bold mb-4">Resultaat</h2>

            <div className="grid grid-cols-3 gap-4">
                <div className="bg-altec-light border border-altec-teal rounded-2xl p-4 mb-3">
                    <p className="text-sm text-gray-500 font-medium">Totale inktfolie verbruik</p>
                    <h3 className="text-xl text-altec-dark font-medium">{calculationResult.foilNeeded} m</h3>
                </div>

                <div className="bg-altec-light border border-altec-teal rounded-2xl p-4 mb-3">
                    <p className="text-sm text-gray-500 font-medium">Totaal aantal inktfolies</p>
                    <h3 className="text-xl text-altec-dark font-medium">{calculationResult.foilRollsNeeded}</h3>
                </div>

                <div className="bg-altec-light border border-altec-teal rounded-2xl p-4 mb-3">
                    <p className="text-sm text-gray-500 font-medium">Laatste inktfolie verbruik</p>
                    <div className="flex flex-row justify-between">
                        <h3 className="text-xl text-altec-dark font-medium">{calculationResult.foilLastUsedNumber} m</h3>
                        <h3 className="text-xl text-altec-dark font-medium">{calculationResult.foilLastUsedPercentage} %</h3>
                    </div>
                </div>
            </div>
            <div className="mt-6">
                <LabelBreakdownTable labelBreakDownList={calculationResult.breakDown} />
            </div>
        </div>
    )
}
