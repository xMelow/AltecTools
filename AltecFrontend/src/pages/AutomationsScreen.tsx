import PrintSdCard from "../components/automations/PrintSdCard"
import PrintSerialNumbers from "../components/automations/PrintSerialNumbers"

export default function AutomationsScreen() {
    return (
        <div>
            <h1 className="text-center text-3xl font-bold text-altec-teal mb-3">Automations</h1>

            <div className="">
                <PrintSerialNumbers />
                <PrintSdCard />
            </div>
        </div>
    )
}
