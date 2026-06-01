import type {LabelBreakdown} from "../types/label.ts";

type LabelBreakdownTableProps = {
    labelBreakDownList: LabelBreakdown[]
}

export default function LabelBreakdownTable({ labelBreakDownList }: LabelBreakdownTableProps) {
    return (
        <table className="w-full table-fixed">
            <thead>
                <tr>
                    <th className="table-header w-1/6">Artikelnummer</th>
                    <th className="table-header relative group w-1/6">Besteld
                        <span className="absolute hidden group-hover:block bottom-full left-0 bg-altec-dark text-white text-xs rounded px-2 py-3 w-48 z-10">
                            Aantal label rollen die de klant heeft besteld.
                        </span>
                    </th>
                    <th className="table-header relative group w-1/6">Rollen/Inktfolie
                        <span className="absolute hidden group-hover:block bottom-full left-0 bg-altec-dark text-white text-xs rounded px-2 py-3 w-48 z-10">
                            Aantal label rollen nodig om 1 inktfolie zo veel mogelijk te gebruiken.
                        </span>
                    </th>
                    <th className="table-header relative group w-1/6">Labels/Inktfolie
                        <span className="absolute hidden group-hover:block bottom-full left-0 bg-altec-dark text-white text-xs rounded px-2 py-3 w-48 z-10">
                            Aantal labels die kunnen geprint worden met 1 inktfolie.
                        </span>
                    </th>
                    <th className="table-header relative group w-1/6">Inktfolies
                        <span className="absolute hidden group-hover:block bottom-full left-0 bg-altec-dark text-white text-xs rounded px-2 py-3 w-48 z-10">
                            Aantal inktfolies nodig om alle labels te kunnen printen.
                        </span>
                    </th>
                    <th className="table-header relative group w-1/6">Verbruik (m)
                        <span className="absolute hidden group-hover:block bottom-full left-0 bg-altec-dark text-white text-xs rounded px-2 py-3 w-48 z-10">
                            Totaal inktfolie verbruik in m van dit artikel.
                        </span>
                    </th>
                    <th className="table-header relative group w-1/6">Verbruik (%)
                    <span className="absolute hidden group-hover:block bottom-full left-0 bg-altec-dark text-white text-xs rounded px-2 py-3 w-48 z-10">
                            Totaal inktfolie verbruik in % van dit artikel.
                        </span>
                </th>
                </tr>
            </thead>
        <tbody>
            {labelBreakDownList.map((breakdown) => (
                <tr  key={breakdown.articleNumber} className="border-b border-gray-100 transition-colors">
                    <td className="table-cell font-semibold">{breakdown.articleNumber}</td>
                    <td className="table-cell">{breakdown.orderedAmount}</td>
                    <td className="table-cell">{breakdown.labelRollsForFullFoil}</td>
                    <td className="table-cell">{breakdown.labelAmountForFullFoil}</td>
                    <td className="table-cell">{breakdown.foilRollsNeeded}</td>
                    <td className="table-cell">{(breakdown.foilUsed / 1000).toFixed()}</td>
                    <td className="table-cell">{Math.round(breakdown.foilUsedPercentage)}</td>
                </tr>
            ))}
        </tbody>
    </table>
    )
}
