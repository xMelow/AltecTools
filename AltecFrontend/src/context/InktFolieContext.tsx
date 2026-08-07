import { createContext, useContext, useState, ReactNode } from "react"
import { ClientOrder } from "../types/label"

type InktFolieContextType = {
    clientOrder: ClientOrder
    setClientOrder: (value: ClientOrder) => void
}

const InktFolieContext = createContext<InktFolieContextType | undefined>(undefined)

export function InktFolieProvider({ children }: { children: ReactNode }) {
    const [clientOrder, setClientOrder] = useState<ClientOrder>({
        foilLength: 300000,
        labelOrders: []
    })

    const value: InktFolieContextType = {
        clientOrder,
        setClientOrder
    }

    return (
        <InktFolieContext.Provider value={value}>
            {children}
        </InktFolieContext.Provider>
    )
}

export function useInktFolieContext() {
    const context = useContext(InktFolieContext)
    if (context === undefined) {
        throw new Error("Inkt Folie context is undefined")
    }
    return context
}
