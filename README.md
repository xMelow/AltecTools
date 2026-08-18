# AltecTools

Internal tooling built for Altec to support day-to-day printing and label workflows.

## Features

- **TSPL** — Preview and validate TSPL label definitions
- **Printers** — Discover and manage printers on the network
- **Automations** — Predefined printing automations used at Altec, including NiceLabel variable extraction/printing and series number printing
- **Ink/Foil Calculator** — Calculate ink or foil usage for label print jobs

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

Automations depend on [NiceLabelApi](https://github.com/xMelow/NiceLabelApi), a separate service that wraps the NiceLabel SDK. Clone it and follow its README to get it running before continuing.

Update `Altec.Api/Altec.Api/appsettings.json` with your NiceLabel API URL:

```json
{
  "NiceLabelApi": {
    "BaseUrl": "https://localhost:44368/"
  }
}
```

From the repo root, install dependencies and start both the frontend and backend together:

```bash
npm install
npm run dev
```

This runs the frontend (`http://localhost:5173`) and the backend (`http://localhost:5258`) concurrently. The frontend proxies `/api` requests to the backend automatically.

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
