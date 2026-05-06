# AltecTools

Internal tooling built for Altec to support day-to-day printing and label workflows.

## Features

- **TSPL** — Preview and validate TSPL label definitions
- **Printers** — Discover and manage printers on the network
- **NiceLabel** — Extract variables from and print NiceLabel label files
- **Automations** — Predefined printing automations used at Altec (e.g. printing series numbers for printers)

## Tech Stack

| Layer    | Technology                              |
|----------|-----------------------------------------|
| Backend  | .NET 9, ASP.NET Core                    |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS |

## Prerequisites

- [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9)
- [Node.js](https://nodejs.org/) (LTS recommended)
- **NiceLabel** installed on the machine — required for the SDK license key

## Getting Started

### 1. Backend

```bash
cd Altec.Api
dotnet run --project Altec.Api
```

The API will start at `http://localhost:5258`.

Update `Altec.Api/Altec.Api/appsettings.json` with your NiceLabel SDK URL:

```json
{
  "NiceLabelApi": {
    "BaseUrl": "https://localhost:44368/"
  }
}
```

### 2. Frontend

```bash
cd AltecFrontend
npm install
npm run dev
```

The frontend will start at `http://localhost:5173` and proxies `/api` requests to the backend automatically.

## Project Structure

```
AltecTools/
├── Altec.Api/          # ASP.NET Core API
│   ├── Altec.Api/      # Main project
│   └── Altec.Api.Test/ # Tests
└── AltecFrontend/      # React frontend
```

## License

Internal tool developed for Altec. All rights reserved.
