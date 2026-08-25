import AutomationSpecs from "./AutomationSpecs";


export default function QlickPrintLicensie() {
    return (
        <div className="shadow-md rounded-2xl p-3 bg-white w-1/4 border border-altec-teal">
            <h2 className="text-xl font-semibold pt-1 mb-2 text-center">QlickPrint licensies</h2>

            <hr className="border-b border-altec-teal mb-3" />

            <AutomationSpecs material="tags" inktFolie="AWH-20" printer="Altec ATP-300 Pro" />
        </div>
    )
}
