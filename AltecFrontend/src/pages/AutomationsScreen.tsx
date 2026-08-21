import PrintSdCard from "../components/automations/PrintSdCard"
import PrintSerialNumbers from "../components/automations/PrintSerialNumbers"
import TestRoom from "../components/automations/TestRoom"

export default function AutomationsScreen() {
    return (
        <div>
            <h1 className="text-center text-3xl font-bold text-altec-teal mb-3">Automations</h1>

            <div className="flex items-stretch gap-5">
                <PrintSerialNumbers />
                <PrintSdCard />
                <TestRoom />
            </div>
        </div>
    )
}
