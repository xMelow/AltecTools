import { createContext, useContext, useState, ReactNode } from "react"
import { PrinterConnectionType, Printer } from "../types/printer"

type PrinterContextType = {
    connectionType: PrinterConnectionType
    setConnectionType: (value: PrinterConnectionType) => void
    printerList: Printer[]
    setPrinterList: (value: Printer[]) => void
    isDiscovering: boolean
    setIsDiscovering: (value: boolean) => void
}

const PrinterContext = createContext<PrinterContextType | undefined>(undefined)

export function PrinterProvider({ children }: { children: ReactNode }) {
    const [connectionType, setConnectionType] = useState<PrinterConnectionType>("Wifi")
    const [printerList, setPrinterList] = useState<Printer[]>([])
    const [isDiscovering, setIsDiscovering] = useState<boolean>(false)

    const value: PrinterContextType = {
        connectionType,
        setConnectionType,
        printerList,
        setPrinterList,
        isDiscovering,
        setIsDiscovering
    }

    return (
        <PrinterContext.Provider value={value}>
            {children}
        </PrinterContext.Provider>
    )
}

export function usePrinterContext() {
    const context = useContext(PrinterContext)
    if (context === undefined) {
        throw new Error("Printer context is undefined")
    }
    return context
}
