import {useEffect, useState} from "react";
import {useFetch} from "../../hooks/useFetch";
import {CommandResponse, EditableSettings, PrinterSettings, PrinterSettingsPanelProps} from "../../types/printer";
import {getPrinterSettings, sendPrinterCommand} from "../../api/printers";
import { EditableRow, SelectRow, SettingRow, SettingsSection} from "./parts";
import ExportPrinterSettings from "../ExportPrinterSetttings";

export default function PrinterSettingsPanel({ ipAddress, onNetworkName }: PrinterSettingsPanelProps) {
    const settingsFetch = useFetch<PrinterSettings>()
    const updateFetch = useFetch<CommandResponse>()
    const s = settingsFetch.result

    const [editableSettings, setEditable] = useState<EditableSettings | null>(null)
    const [showSuccess, setShowSuccess] = useState(false)
    const [showExport, setShowExport] = useState(false)

    useEffect(() => {
        if (ipAddress) {
            settingsFetch.execute(() => getPrinterSettings(ipAddress))
        }
    }, [ipAddress])

    useEffect(() => {
        if (s) {
            if (s.dnsName) onNetworkName?.(s.dnsName)
            setEditable({
                postPrint: s.postPrint,
                speed: s.speed,
                density: s.density,
                labelWidth: s.labelWidth,
                labelHeight: s.labelHeight,
                blineSize: s.blineSize,
                direction: s.direction,
                mirror: s.mirror,
                ribbon: s.ribbon,
                sensorType: s.sensorType,
                gapSize: s.gapSize,
                gapOffset: s.gapOffset,
                offset: s.offset,
                shiftX: s.shiftX,
                shiftY: s.shiftY,
                referenceX: s.referenceX,
                referenceY: s.referenceY,   
                countryCode: s.countryCode,
                codePage: s.codePage,
            })
        }
    }, [s])

    useEffect(() => {
        if (!updateFetch.result) return
        setShowSuccess(true)
        const timer = setTimeout(() => setShowSuccess(false), 3000)
        return () => clearTimeout(timer)
    }, [updateFetch.result])

    const set = (key: keyof EditableSettings) => (value: string | number) =>
        setEditable(prev => prev ? { ...prev, [key]: value } : prev)

    const handleRefresh = () => {
        if (ipAddress) settingsFetch.execute(() => getPrinterSettings(ipAddress))
    }

    const handleUpdate = () => {
        if (!ipAddress || !editableSettings) return

        let updateSensorType = setSensorType(editableSettings.sensorType, editableSettings.gapSize, editableSettings.gapOffset)
        let postPrint = setPostPrint(editableSettings.postPrint)
        
        const commands = [
            `SPEED ${editableSettings.speed}`,
            `DENSITY ${editableSettings.density}`,
            `SIZE ${editableSettings.labelWidth} mm,${editableSettings.labelHeight} mm`,
            `${updateSensorType}`,
            `DIRECTION ${editableSettings.direction}, ${editableSettings.mirror}`,
            `SET RIBBON ${editableSettings.ribbon}`,
            `OFFSET ${editableSettings.offset}`,
            `SHIFT ${editableSettings.shiftX}, ${editableSettings.shiftY}`,
            `REFERENCE ${editableSettings.referenceX},${editableSettings.referenceY}`,
            `COUNTRY ${editableSettings.countryCode}`,
            `CODEPAGE ${editableSettings.codePage}`,
            ...postPrint
        ].join('\r\n')
        updateFetch.execute(() => sendPrinterCommand(ipAddress, commands))
    }

    const setSensorType = (sensorType: string, gapSize: number, gapOffset: number) => {
        if (sensorType == "GAP") return `GAP ${gapSize} mm,${gapOffset} mm`
        if (sensorType == "BLINE") return `BLINE ${gapSize} mm,${gapOffset} mm`
        if (sensorType == "CONTINUOUS") return `GAP 0 mm,0 mm`
    }

    const setPostPrint = (postPrint: string): string[] => {
        if (postPrint == "Tear Off") return ["SET CUTTER OFF", "SET PEEL OFF", "SET TEAR ON"]
        if (postPrint == "Cutter") return ["SET PEEL OFF", "SET TEAR OFF", "SET CUTTER ON"]
        if (postPrint == "Peel") return ["SET CUTTER OFF", "SET TEAR OFF", "SET PEEL ON"]
        if (postPrint == "Off") return ["SET CUTTER OFF", "SET PEEL OFF", "SET TEAR OFF"]
        return []
    }

    return (
        <div className="w-1/4 flex flex-col border rounded-2xl border-altec-teal bg-altec-white max-h-[75vh]">
            <div className="px-4 pt-4 shrink-0">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">Printer Settings</h3>
                    <div>
                        <button
                            className="mr-2 text-xs border border-altec-teal text-altec-teal px-2 py-0.5 rounded-lg hover:bg-altec-light transition-colors disabled:opacity-50"
                            onClick={() => setShowExport(true)}
                        >
                            Export
                        </button>
                        {showExport && <ExportPrinterSettings printerSettings={s!} editableSettings={editableSettings!} closePopUp={() => setShowExport(false)} /> }
                        <button
                            className="text-xs border border-altec-teal text-altec-teal px-2 py-0.5 rounded-lg hover:bg-altec-light transition-colors disabled:opacity-50"
                            onClick={handleRefresh}
                            disabled={settingsFetch.loading}
                        >
                            Refresh
                        </button>
                    </div>
                </div>
                <hr className="border-b border-altec-teal mb-3" />
            </div>

            <div className="overflow-y-auto px-4 grow">
                {settingsFetch.loading && <p className="text-sm text-altec-teal">Loading...</p>}

                {s && editableSettings ? (
                    <>
                        <SettingsSection title="Device">
                            <SettingRow label="Printer Status" value={s.printerStatus} />
                            <SettingRow label="Model" value={s.model} />
                            <SettingRow label="Serial Number" value={s.serial} />
                            <SettingRow label="Version" value={s.version} />
                            <SettingRow label="Check Sum" value={s.checkSum} />
                            <SettingRow label="DPI" value={s.dpi} />
                        </SettingsSection>

                        <SettingsSection title="Network">
                            <SettingRow label="IP Address" value={s.ipAddressNet} />
                            <SettingRow label="MAC Address" value={s.macAddressNet} />
                            <SettingRow label="DNS Name" value={s.dnsName} />
                        </SettingsSection>

                        <SettingsSection title="Counters">
                            <SettingRow label="Mileage" value={s.mileage} />
                            <SettingRow label="Label Counter" value={s.labelCounter} />
                            <SettingRow label="Cutter Counter" value={s.cutterCounter} />
                        </SettingsSection>

                        <SettingsSection title="Print">
                            <SelectRow label="Speed" value={editableSettings.speed} width={20} options={['1', '2', '3', '4', '5', '6']} onChange={set('speed')} />
                            <SelectRow label="Density" value={editableSettings.density} width={20} options={['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']} onChange={set('density')} />
                            <SelectRow label="Direction" value={editableSettings.direction === 0 ? "Normal" : "Reversed"} options={["Normal", "Reversed"]} width={20} onChange={v => set('direction')(v === "Normal" ? 0 : 1)} />
                            <SelectRow label="Mirror" value={editableSettings.mirror === 1 ? "Yes" : "No"} options={["Yes", "No"]} width={20} onChange={v => set('mirror')(v === "Yes" ? 1 : 0)} />
                            <SelectRow label="Ribbon" value={editableSettings.ribbon === 1 ? "On" : "Off"} options={["On", "Off"]} width={20} onChange={v => set('ribbon')(v === "On" ? "YES" : "NO")} />
                        </SettingsSection>

                        <SettingsSection title="Label">
                            <SelectRow label="Post Print Action" width={20} value={editableSettings.postPrint} options={['Tear Off', 'Cutter', 'Peel', 'Off']} onChange={set('postPrint')} />
                            <SelectRow label="Sensor Type" width={30} value={editableSettings.sensorType} options={['GAP', 'BLINE', 'CONTINUOUS']} onChange={set('sensorType')} />
                            <EditableRow label="Label Width" value={editableSettings.labelWidth} onChange={set('labelWidth')} unit="mm"/>
                            <EditableRow label="Label Height" value={editableSettings.labelHeight} onChange={set('labelHeight')} unit="mm"/>
                            <EditableRow label="Gap Size" value={editableSettings.gapSize} onChange={set('gapSize')} unit="mm"/>
                            <EditableRow label="Gap Offset" value={editableSettings.gapOffset} onChange={set('gapOffset')} unit="mm"/>
                            <EditableRow label="Offset" value={editableSettings.offset} onChange={set('offset')} unit="mm"/>
                            <EditableRow label="Shift X" value={editableSettings.shiftX} onChange={set('shiftX')} unit="mm"/>
                            <EditableRow label="Shift Y" value={editableSettings.shiftY} onChange={set('shiftY')} unit="mm"/>
                            <EditableRow label="Reference X" value={editableSettings.referenceX} onChange={set('referenceX')} unit="mm"/>
                            <EditableRow label="Reference Y" value={editableSettings.referenceY} onChange={set('referenceY')} unit="mm"/>
                        </SettingsSection>

                        <SettingsSection title="Locale">
                            <EditableRow label="Country Code" value={editableSettings.countryCode} onChange={set('countryCode')} />
                            <EditableRow label="Code Page" value={editableSettings.codePage} onChange={set('codePage')} />
                        </SettingsSection>
                    </>
                ) : !settingsFetch.loading && settingsFetch.error && (
                    <p className="text-sm text-red-500">{settingsFetch.error}</p>
                )}
            </div>

            {s && editableSettings && (
                <div className="px-4 pb-4 pt-2 shrink-0">
                    {updateFetch.error && (
                        <p className="text-sm text-red-500 mb-2">{updateFetch.error}</p>
                    )}
                    {showSuccess && (
                        <p className="text-sm text-green-600 mb-2">Settings updated</p>
                    )}
                    <button
                        className="w-full border border-altec-teal text-altec-teal py-1.5 rounded-lg text-sm font-medium hover:bg-altec-light transition-colors disabled:opacity-50"
                        onClick={handleUpdate}
                        disabled={updateFetch.loading}
                    >
                        {updateFetch.loading ? "Updating..." : "Update Settings"}
                    </button>
                </div>
            )}
        </div>
    )
}
