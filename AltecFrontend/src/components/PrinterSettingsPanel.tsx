import {useEffect} from "react";
import {useFetch} from "../hooks/useFetch";
import {PrinterSettings} from "../types/printer";
import {getPrinterSettings} from "../api/printers";

type Props = {
    ipAddress: string | undefined
}

function SettingRow({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="flex justify-between items-center py-1.5 border-b border-altec-light last:border-0">
            <span className="text-gray-500 text-sm">{label}</span>
            <span className="font-medium text-sm text-right ml-4">{value}</span>
        </div>
    )
}

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="mb-4">
            <p className="text-xs font-semibold text-altec-teal uppercase tracking-wide mb-1.5">{title}</p>
            <div className="flex flex-col">
                {children}
            </div>
        </div>
    )
}

export default function PrinterSettingsPanel({ ipAddress }: Props) {
    const settingsFetch = useFetch<PrinterSettings>()
    const s = settingsFetch.result

    useEffect(() => {
        if (ipAddress) {
            settingsFetch.execute(() => getPrinterSettings(ipAddress))
        }
    }, [ipAddress])

    return (
        <div className="w-1/4 flex flex-col border rounded-2xl border-altec-teal bg-altec-white p-4 max-h-[75vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-2">Printer Settings</h3>
            <hr className="border-b border-altec-teal mb-3" />

            {settingsFetch.loading && <p className="text-sm text-altec-teal">Loading...</p>}

            {s ? (
                <>
                    <button>
                        Refresh
                    </button>
                    <SettingsSection title="Device">
                        <SettingRow label="Model" value={s.model} />
                        <SettingRow label="Serial" value={s.serial} />
                        <SettingRow label="Version" value={s.version} />
                        <SettingRow label="DPI" value={s.dpi} />
                    </SettingsSection>

                    <SettingsSection title="Network">
                        <SettingRow label="IP Address" value={s.ipAddressNet} />
                        <SettingRow label="MAC Address" value={s.macAddressNet} />
                        <SettingRow label="Network Name" value={s.networkName} />
                    </SettingsSection>

                    <SettingsSection title="TSPL">
                        <SettingRow label="Speed" value={s.speed} />
                        <SettingRow label="Density" value={s.density} />
                        <SettingRow label="Direction" value={s.direction} />
                        <SettingRow label="Ribbon" value={s.ribbon} />
                    </SettingsSection>

                    <SettingsSection title="Label">
                        <SettingRow label="Sensor Type" value={s.sensorType} />
                        <SettingRow label="Label Width" value={s.labelWidth} />
                        <SettingRow label="Label Height" value={s.labelHeight} />
                        <SettingRow label="Gap Size" value={s.gapSize} />
                        <SettingRow label="Gap Size Offset" value={s.gapSizeOffset} />
                        <SettingRow label="Gap Offset" value={s.gapOffset} />
                        <SettingRow label="Bline Size" value={s.blineSize} />
                        <SettingRow label="Offset" value={s.offset} />
                        <SettingRow label="Shift X" value={s.shiftX} />
                        <SettingRow label="Shift Y" value={s.shiftY} />
                    </SettingsSection>

                    <SettingsSection title="Counters">
                        <SettingRow label="Mileage" value={s.mileage} />
                        <SettingRow label="Label Counter" value={s.labelCounter} />
                    </SettingsSection>

                    <SettingsSection title="Locale">
                        <SettingRow label="Country Code" value={s.countryCode} />
                        <SettingRow label="Code Page" value={s.codePage} />
                    </SettingsSection>
                </>
            ) : !settingsFetch.loading && settingsFetch.error && (
                <p className="text-sm text-red-500">{settingsFetch.error}</p>
            )}
        </div>
    )
}
