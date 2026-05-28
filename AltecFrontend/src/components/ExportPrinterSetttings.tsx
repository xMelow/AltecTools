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

    const sectionsData = [
        {
            title: "Device",
            fields: [
                {
                    label: "Model",
                    value: printerSettings.model
                },
                {
                    label: "Serial",
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
        a.download = "settings.txt";
        a.click();
        URL.revokeObjectURL(url);
    }

    return (
        // TODO 4: the modal UI
        // - dark overlay behind
        // - white box in the center
        // - title "Export Settings"
        // - list of sections with checkboxes
        // - Cancel and Export buttons
        <div className="fixed inset-0 bg-black/60">
            <h2>Export Settings</h2>
            {Object.entries(sections).map(([key, value]) => (
                <div key={key}>
                    <input type="checkbox" id={key} name={key} checked={value} onChange={() => setSections(prev => ({ ...prev, [key]: !prev[key] }))} />
                    <label htmlFor={key}>{key}</label>
                </div>
            ))}

            <div>
                <button onClick={exportSettings}>Export</button>
                <button onClick={closePopUp}>Cancel</button>
            </div>
        </div>
    )
}
