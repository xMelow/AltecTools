# Altec Api

## Introduction
This is an API built for the company Altec to make our job easier.

## Requirements
- .NET 9
- IDE

## Installation
1. Clone the repository
2. open the project
3. run the project 
4. open http://localhost:5258

## Configuration
Update `appsettings.json` with the NiceLabel SDK API URL:
```json
{
  "NiceLabelApi": {
    "BaseUrl": "https://localhost:44368/"
  }
}
```

## Endpoints
All API endpoints are documented via Swagger UI, available at `/swagger` when running in development.

## Project Structure

```
Altec.Api/
├── Altec.Api/          # Main project
│   ├── Controllers/    # API endpoints (Automation, NiceLabel, Printer, Tspl)
│   ├── Domain/         # Core domain logic (Printers, Tspl)
│   ├── Services/       # Application services (Automation, NiceLabel, Printers, Tspl)
│   ├── Record/         # DTOs / request-response models
│   └── Resource/       # Static assets (fonts, label templates)
└── Altec.Api.Test/     # Tests
```

## License
This is an internal tool developed for Altec. All rights reserved.
