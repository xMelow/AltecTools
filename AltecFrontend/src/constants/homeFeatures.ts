export type SubFeature = {
    title: string;
    description: string;
    bullets: string[];
    route?: string;
};

type FeatureBase = {
    title: string;
    description: string;
    bullets?: string[];
};

export type Feature = FeatureBase &
    (
        | { route: string; subFeatures?: never }
        | { route?: never; subFeatures: SubFeature[] }
    );

export const features: Feature[] = [
    {
        title: "Tools",
        description:
            "Design TSPL labels with a live preview, and calculate how much ribbon foil a client's label order will use.",
        subFeatures: [
            {
                title: "Label Preview",
                route: "/tools/tspl-preview",
                description:
                    "Write and preview TSPL label definitions in real time. Import images and toggle block outlines to fine-tune your label design before sending it to a printer.",
                bullets: [
                    "Live TSPL code preview",
                    "Image import support",
                    "Block outline visualization",
                ],
            },
            {
                title: "Inkt Folie Calculator",
                route: "/tools/ink-calculator",
                description:
                    "Calculate how much ribbon foil is needed to print a client's label order. Add label sizes and quantities to see the required foil length against your roll length.",
                bullets: [
                    "Per-label dimension input",
                    "Multiple label orders per calculation",
                    "Foil usage vs. roll length comparison",
                ],
            },
        ],
    },
    {
        title: "Printer Management",
        route: "/printers",
        description:
            "Manage your printers by connecting over WiFi with an IP address or discovering printers connected via USB, then access full settings and controls.",
        bullets: [
            "Connect by IP address (WiFi)",
            "USB printer discovery",
            "Per-printer settings & controls",
        ],
    },
    {
        title: "Automations",
        description:
            "Run predefined printing workflows to speed up repetitive tasks. More automations will be added over time as new workflows are introduced.",
        subFeatures: [
            {
                title: "Print Serial Numbers",
                route: "/automations",
                description:
                    "Print serial number labels for new printers straight from an Excel file, with a live label preview before printing.",
                bullets: [
                    "Print serial numbers from Excel",
                    "Supports ATP-300 Pro, ATP-600 Pro, ATP-3000",
                    "NiceLabel file integration",
                ],
            },
            {
                title: "SD Kaart",
                route: "/automations",
                description:
                    "Print SD card labels by order number and version, with a live label preview before printing.",
                bullets: [
                    "Print by order number & version",
                    "Configurable print amount",
                ],
            },
            {
                title: "Testruimte Systeem",
                route: "/automations",
                description: "Print testruimte label with configurable sensor type, speed, and density settings.",
                bullets: [
                    "Cutter and user label toggles for extra options",
                    "Select a printer from the NiceLabel installed printers"
                ]
            },
            {
                title: "RMA Systeem",
                route: "/automations",
                description:
                    "Generate an RMA PDF and a prefilled support email when a customer's printer needs to come in for repair.",
                bullets: [
                    "RMA PDF with customer, model, serial & problem details",
                    "Prefilled mailto in Dutch, English or French",
                    "Mark warranty status and items not to send back",
                ],
            },
            {
                title: "QlickPrint Licensies",
                route: "/automations",
                description:
                    "Print QlickPrint license tags in bulk from an exported text file.",
                bullets: [
                    "Reads licenses straight from a .txt data file",
                    "Prints on Altec ATP-300 Pro with AWH-20 ink foil",
                    "Prints an A4 sheet with every code & barcode",
                ],
            }
        ],
    },
];
