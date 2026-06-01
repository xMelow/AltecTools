import type {CalculationResult, ClientOrder, LabelBreakdown} from "../types/label.ts";

export function calculateFolieAmount(order: ClientOrder): CalculationResult {
    const result: CalculationResult = { foilNeeded: 0, foilRollsNeeded: 0, foilLastUsedNumber: 0, foilLastUsedPercentage: 0, breakDown: [] };
    const labelBreakdowns: LabelBreakdown[] = []
    let totalFoilNeeded = 0;

    for (const labelOrder of order.labelOrders) {

        const labelRolTotalHeight = (labelOrder.label.height + labelOrder.label.gap) * (labelOrder.label.totalLabels / labelOrder.label.labelsPerRow) * labelOrder.labelRollsOrdered;
        totalFoilNeeded += labelRolTotalHeight;

        const foilRollsNeededCurrentLabel = Math.ceil(labelRolTotalHeight / order.foilLength);
        const foilPerLabelRoll = labelRolTotalHeight / labelOrder.labelRollsOrdered
        const labelRollsForFullFoil = Number((order.foilLength / foilPerLabelRoll).toFixed(2))
        const labelsPerFoilRoll = Math.floor(labelRollsForFullFoil * labelOrder.label.totalLabels)

        const breakdown: LabelBreakdown = {
            articleNumber: labelOrder.label.articleNumber,
            orderedAmount: labelOrder.labelRollsOrdered,
            labelRollsForFullFoil: labelRollsForFullFoil,
            labelAmountForFullFoil: labelsPerFoilRoll,
            foilUsed: labelRolTotalHeight,
            foilRollsNeeded: foilRollsNeededCurrentLabel,
            foilUsedPercentage: 0
        }
        labelBreakdowns.push(breakdown)
    }
     
    labelBreakdowns.forEach(b => {
        b.foilUsedPercentage = (b.foilUsed / totalFoilNeeded) * 100
    })

    result.breakDown = labelBreakdowns
    result.foilNeeded = Number((totalFoilNeeded / 1000).toFixed())
    result.foilRollsNeeded = Math.ceil(totalFoilNeeded / order.foilLength)
    const lastRollUsed = totalFoilNeeded - (result.foilRollsNeeded - 1) * order.foilLength
    result.foilLastUsedNumber = Math.round(lastRollUsed / 1000)
    result.foilLastUsedPercentage = Math.round((lastRollUsed / order.foilLength) * 100)

    return result;
}
