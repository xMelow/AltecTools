import PrintSdCard from "../components/automations/PrintSdCard"
import PrintSerialNumbers from "../components/automations/PrintSerialNumbers"
import QlickPrintLicensie from "../components/automations/QlickPrintLicensie"
import TestRoom from "../components/automations/TestRoom"

export default function AutomationsScreen() {
    return (
        <div>
            <h1 className="text-center text-3xl font-bold text-altec-teal mb-3">Automations</h1>

            <section>
                <h2 className="text-xl mb-4 font-bold">Support</h2>
                <div className="flex items-start gap-5">
                    <TestRoom />
                    <PrintSdCard />
                </div>
            </section>

            <section>
                <h2 className="text-xl mb-4 mt-4 font-bold">Administration</h2>
                <div className="flex items-start gap-5">
                    <PrintSerialNumbers />
                    <QlickPrintLicensie />
                </div>
            </section>
        </div>
    )
}
