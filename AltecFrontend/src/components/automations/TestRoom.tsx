import AutomationSpecs from "./AutomationSpecs"


export default function TestRoom() {
    return ( 
        <div className="shadow-md rounded-2xl p-3 bg-white w-1/4 border border-altec-teal">
            <h2 className="text-xl font-semibold pt-1 mb-2 text-center">Testruimte systeem</h2>

            <hr className="border-b border-altec-teal mb-3" />

            <AutomationSpecs material="I00180" inktFolie="AR-10"/>

            {/* select option values beide, Gap, Mark */}

            {/* speed and density value inputs */}

            {/* option for cutter or user label */}

            {/* printer selection */}

            {/* Print button */}
        </div>
    )
}