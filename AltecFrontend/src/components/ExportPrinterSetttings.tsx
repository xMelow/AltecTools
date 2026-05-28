import { useState } from "react"
import { EditableSettings, PrinterSettings } from "../types/printer"

type ExportPrinterSettingsProps = {
    printerSettings: PrinterSettings,
    editableSettings: EditableSettings,
    closePopUp: () => void
}

export default function ExportPrinterSettings({ printerSettings, editableSettings, closePopUp }: ExportPrinterSettingsProps) {

    const [sections, setSections] = useState<Record<string, boolean>>({
        Device: true, 
        Network: true, 
        Counters: true, 
        Print: true, 
        Label: true, 
        Locale: true
    })
    const [fileName, setFileName] = useState(`settings-${printerSettings.dnsName}.txt`)

    const sectionsData = [
        {
            title: "Device",
            fields: [
                {
                    label: "Model",
                    value: printerSettings.model
                },
                {
                    label: "Serial Number",
                    value: printerSettings.serial
                },
                {
                    label: "Version",
                    value: printerSettings.version
                },
                {
                    label: "Check Sum",
                    value: printerSettings.checkSum
                },
                {
                    label: "DPI",
                    value: printerSettings.dpi
                }
            ]
        },
        {
            title: "Network",
            fields: [
                {
                    label: "IP Address",
                    value: printerSettings.ipAddressNet
                },
                {
                    label: "MAC Address",
                    value: printerSettings.macAddressNet
                },
                {
                    label: "DNS Name",
                    value: printerSettings.dnsName
                }
            ]
        },
        {
            title: "Counters",
            fields: [
                {
                    label: "Mileage",
                    value: printerSettings.mileage
                },
                {
                    label: "Label Counter",
                    value: printerSettings.labelCounter
                },
                {
                    label: "Cutter counter",
                    value: printerSettings.cutterCounter
                }
            ]
        }, 
        {
            title: "Print",
            fields: [
                {
                    label: "Speed",
                    value: editableSettings.speed
                },
                {
                    label: "Density",
                    value: editableSettings.density
                },
                {
                    label: "Direction",
                    value: editableSettings.direction === 0 ? "Normal" : "Reversed"
                },
                {
                    label: "Mirror",
                    value: editableSettings.mirror === 1 ? "Yes" : "No"
                },
                {
                    label: "Ribbon",
                    value: editableSettings.ribbon === 1 ? "On" : "Off"
                }
            ]
        },
        {
            title: "Label",
            fields: [
                {
                    label: "Post Print Action",
                    value: editableSettings.postPrint
                },
                {
                    label: "Sensor Type",
                    value: editableSettings.sensorType
                },
                {
                    label: "Label Width",
                    value: `${editableSettings.labelWidth} mm`
                },
                {
                    label: "Label Height",
                    value: `${editableSettings.labelHeight} mm`
                },
                {
                    label: "Gap Size",
                    value: `${editableSettings.gapSize} mm`
                },
                {
                    label: "Gap Offset",
                    value: `${editableSettings.gapOffset} mm`
                },
                {
                    label: "Offset",
                    value: `${editableSettings.offset} mm`
                },
                {
                    label: "Shift X",
                    value: `${editableSettings.shiftX} mm`
                },
                {
                    label: "Shift Y",
                    value: `${editableSettings.shiftY} mm`
                },
                {
                    label: "Reference X",
                    value: `${editableSettings.referenceX} mm`
                },
                {
                    label: "Reference Y",
                    value: `${editableSettings.referenceY} mm`
                }
            ]
        },
        {
            title: "Locale",
            fields: [
                {
                    label: "Country Code",
                    value: editableSettings.countryCode
                },
                {
                    label: "Code Page",
                    value: editableSettings.codePage
                }
            ]
        }
    ]

    const exportSettings = () => {
        let settingsData = ""

        sectionsData.forEach(el => {
            if (sections[el.title]) {
                settingsData += `[${el.title}]\n`
                el.fields.forEach(field => {
                    settingsData += `${field.label}: ${field.value}\n`
                });
                settingsData += "\n"
            }
        });

        exportFile(settingsData)
    }

    const exportFile = (content: string) => {
        const blob = new Blob([content], { type: "text/plain" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
    }

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-altec-white border border-altec-teal rounded-2xl p-6 w-80 flex flex-col gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-altec-dark mb-2">Export Settings</h2>
                    <hr className="border-b border-altec-teal"/>
                </div>

                <div className="flex flex-col gap-2">
                    {Object.entries(sections).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id={key}
                                name={key}
                                checked={value}
                                onChange={() => setSections(prev => ({ ...prev, [key]: !prev[key] }))}
                                className="accent-altec-teal w-4 h-4 cursor-pointer"
                            />
                            <label htmlFor={key} className="text-sm cursor-pointer">{key}</label>
                        </div>
                    ))}

                    <div className="flex flex-col gap-1 mt-2">
                        <label className="text-xs text-gray-500">File name</label>
                        <input
                            type="text"
                            value={fileName}
                            onChange={(e) => setFileName(e.target.value)}
                            className="text-sm border border-altec-teal rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-altec-teal bg-altec-white"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                    <button
                        className="text-xs border border-altec-teal text-altec-teal px-3 py-1 rounded-lg hover:bg-altec-light transition-colors"
                        onClick={closePopUp}
                    >
                        Cancel
                    </button>
                    <button
                        className="text-xs bg-altec-teal text-white px-3 py-1 rounded-lg hover:opacity-90 transition-opacity"
                        onClick={exportSettings}
                    >
                        Export
                    </button>
                </div>
            </div>
        </div>
    )
}
