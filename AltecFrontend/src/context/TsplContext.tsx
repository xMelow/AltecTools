import { createContext, useContext, useState, ReactNode } from "react"

type TsplContextType = {
    labelTspl: string
    setLabelTspl: (value: string) => void
    showBlockOutline: boolean
    setBlockOutline: (value: boolean) => void
    labelImages: Record<string, string>
    setLabelImages: React.Dispatch<React.SetStateAction<Record<string, string>>>
    labelPreview: string | undefined
    setLabelPreview: (value: string | undefined) => void
}

const TsplContext = createContext<TsplContextType | undefined>(undefined)

export function TsplProvider({ children }: { children: ReactNode }) {
    const [labelTspl, setLabelTspl] = useState<string>("")
    const [showBlockOutline, setBlockOutline] = useState<boolean>(false)
    const [labelImages, setLabelImages] = useState<Record<string, string>>({})
    const [labelPreview, setLabelPreview] = useState<string | undefined>(undefined)

    const value: TsplContextType = {
        labelTspl,
        setLabelTspl,
        showBlockOutline,
        setBlockOutline,
        labelImages,
        setLabelImages,
        labelPreview,
        setLabelPreview
    }

    return (
        <TsplContext.Provider value={value}>
            {children}
        </TsplContext.Provider>
    )
}

export function useTsplContext() {
    const context = useContext(TsplContext)
    if (context === undefined) {
        throw new Error("TSPL context is undefined")
    }
    return context
}
