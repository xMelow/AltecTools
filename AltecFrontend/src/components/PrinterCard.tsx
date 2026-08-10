import {Printer} from "../types/printer";
import {Link} from "react-router-dom";

type PrinterCardProps = {
    printer: Printer
    disabled: boolean
}

export default function PrinterCard({printer, disabled}: PrinterCardProps) {
    return (
        <div
            className="w-1/5 max-w-xs h-1/4 pl-5 pb-5 pr-5 flex flex-col border rounded-2xl border-altec-teal bg-altec-white justify-center">
            <Link 
                className={disabled ? "cursor-not-allowed opacity-50" : ""}
                to={`/printers/${encodeURIComponent(printer.address)}`} 
                state={{ name: printer.name, connectionType: printer.connectionType, model: printer.model }}
                onClick={(e) => {if (disabled) e.preventDefault()}}
            >

                <div className="flex justify-between items-center pt-2 pb-2">
                    <p className="font-semibold">{printer.name || printer.address}</p>
                    <p className="border border-altec-teal bg-altec-light rounded-xl p-1 w-8">🖨️</p>
                </div>

                <div className="border-b border-altec-teal"/>

                <div className="flex justify-between mt-1">
                    <span className="">Address</span>

                    { printer.connectionType === "Usb"
                        ? <span className="">USB</span>
                        : <span className="">{printer.address}</span>
                    }
                </div>

                <div className="flex justify-between">
                    <span className="">Model</span>
                    <span className="">{printer.model}</span>
                </div>

                <div className="flex justify-between">
                    <span className="">Connection Type</span>
                    <span className="">{printer.connectionType}</span>
                </div>
            </Link>
        </div>
    )
}
