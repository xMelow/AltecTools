import {useEffect, useState} from "react";
import {useFetch} from "../../hooks/useFetch";
import {CommandResponse, EditableSettings, PrinterSettings, PrinterSettingsPanelProps} from "../../types/printer";
import {getPrinterSettings, sendPrinterCommand} from "../../api/printers";
import { EditableRow, SelectRow, SettingRow, SettingsSection } from "./parts";

export default function PrinterSettingsPanel({ ipAddress, onNetworkName }: PrinterSettingsPanelProps) {
    const settingsFetch = useFetch<PrinterSettings>()
    const updateFetch = useFetch<CommandResponse>()
    const s = settingsFetch.result

    const [editableSettings, setEditable] = useState<EditableSettings | null>(null)
    const [showSuccess, setShowSuccess] = useState(false)

    useEffect(() => {
        if (ipAddress) {
            settingsFetch.execute(() => getPrinterSettings(ipAddress))
        }
    }, [ipAddress])

    useEffect(() => {
        if (s) {
            if (s.networkName) onNetworkName?.(s.networkName)
            setEditable({
                speed: String(s.speed),
                density: String(s.density),
                direction: s.direction,
                ribbon: s.ribbon,
                sensorType: s.sensorType,
                labelWidth: s.labelWidth,
                labelHeight: s.labelHeight,
                gapSize: s.gapSize,
                gapSizeOffset: s.gapSizeOffset,
                gapOffset: String(s.gapOffset),
                blineSize: String(s.blineSize),
                offset: String(s.offset),
                shiftX: String(s.shiftX),
                shiftY: String(s.shiftY),
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

    const set = (key: keyof EditableSettings) => (value: string) =>
        setEditable(prev => prev ? { ...prev, [key]: value } : prev)

    const handleRefresh = () => {
        if (ipAddress) settingsFetch.execute(() => getPrinterSettings(ipAddress))
    }

    const handleUpdate = () => {
        if (!ipAddress || !editableSettings) return
        const commands = [
            `SPEED ${editableSettings.speed}`,
            `DENSITY ${editableSettings.density}`,
            `DIRECTION ${editableSettings.direction}`,
            `SET RIBBON ${editableSettings.ribbon}`,
            `SIZE ${editableSettings.labelWidth},${editableSettings.labelHeight}`,
            `GAP ${editableSettings.gapSize},${editableSettings.gapSizeOffset}`,
            `BLINE ${editableSettings.blineSize},0`,
            `OFFSET ${editableSettings.offset}`,
            `COUNTRY ${editableSettings.countryCode}`,
            `CODEPAGE ${editableSettings.codePage}`,
        ].join('\r\n')
        updateFetch.execute(() => sendPrinterCommand(ipAddress, commands))
    }

    return (
        <div className="w-1/4 flex flex-col border rounded-2xl border-altec-teal bg-altec-white max-h-[75vh]">
            <div className="px-4 pt-4 shrink-0">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">Printer Settings</h3>
                    <button
                        className="text-xs border border-altec-teal text-altec-teal px-2 py-0.5 rounded-lg hover:bg-altec-light transition-colors disabled:opacity-50"
                        onClick={handleRefresh}
                        disabled={settingsFetch.loading}
                    >
                        Refresh
                    </button>
                </div>
                <hr className="border-b border-altec-teal mb-3" />
            </div>

            <div className="overflow-y-auto px-4 grow">
                {settingsFetch.loading && <p className="text-sm text-altec-teal">Loading...</p>}

                {s && editableSettings ? (
                    <>
                        <SettingsSection title="Device">
                            <SettingRow label="Model" value={s.model} />
                            <SettingRow label="Serial" value={s.serial} />
                            <SettingRow label="Version" value={s.version} />
                            <SettingRow label="DPI" value={s.dpi} />
                        </SettingsSection>

                        <SettingsSection title="Network">
                            <SettingRow label="IP Address" value={s.ipAddressNet} />
                            <SettingRow label="MAC Address" value={s.macAddressNet} />
                            <SettingRow label="DNS Name" value={s.networkName} />
                        </SettingsSection>

                        <SettingsSection title="TSPL">
                            <SelectRow label="Speed" value={editableSettings.speed} options={['1', '2', '3', '4', '5', '6']} onChange={set('speed')} />
                            <SelectRow label="Density" value={editableSettings.density} options={['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']} onChange={set('density')} />
                            <EditableRow label="Direction" value={editableSettings.direction} onChange={set('direction')} />
                            <EditableRow label="Ribbon" value={editableSettings.ribbon} onChange={set('ribbon')} />
                        </SettingsSection>

                        <SettingsSection title="Label">
                            <SelectRow label="Sensor Type" value={editableSettings.sensorType} options={['GAP', 'MARK', 'CONTINU']} onChange={set('sensorType')} />
                            <EditableRow label="Label Width" value={editableSettings.labelWidth} onChange={set('labelWidth')} />
                            <EditableRow label="Label Height" value={editableSettings.labelHeight} onChange={set('labelHeight')} />
                            <EditableRow label="Gap Size" value={editableSettings.gapSize} onChange={set('gapSize')} />
                            <EditableRow label="Gap Size Offset" value={editableSettings.gapSizeOffset} onChange={set('gapSizeOffset')} />
                            <EditableRow label="Gap Offset" value={editableSettings.gapOffset} onChange={set('gapOffset')} />
                            <EditableRow label="Bline Size" value={editableSettings.blineSize} onChange={set('blineSize')} />
                            <EditableRow label="Offset" value={editableSettings.offset} onChange={set('offset')} />
                            <EditableRow label="Shift X" value={editableSettings.shiftX} onChange={set('shiftX')} />
                            <EditableRow label="Shift Y" value={editableSettings.shiftY} onChange={set('shiftY')} />
                        </SettingsSection>

                        <SettingsSection title="Counters">
                            <SettingRow label="Mileage" value={s.mileage} />
                            <SettingRow label="Label Counter" value={s.labelCounter} />
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
