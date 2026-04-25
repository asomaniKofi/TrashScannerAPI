# 🗑️ TrashScannerAPI

**TrashScannerAPI** is the backend REST API powering the [ScanMyTrash](https://github.com/asomaniKofi/ScanMyTrash) application. It accepts a scanned product barcode and a user's council/area, then looks up both the product's material and the local bin collection data to tell the user exactly which bin to use and when their next collection is.

---

## ✨ Features

- 🔍 **Barcode-to-Bin Resolution** — Accepts a product barcode and area, looks up the product material, and matches it against local bin contents to return disposal guidance
- 🗃️ **Product Database Lookup** — Queries a product database by barcode to retrieve material information
- 🗺️ **Area-Based Bin Data** — Retrieves bin collection schedules and contents for a given council area
- 📅 **Collection Date Info** — Returns bin name, material, next collection date, and collection frequency
- 📧 **Email Notifications** — Nodemailer/Gmail integration for notification workflows
- 🧪 **Integration Testing** — Jest, Supertest, and in-memory MongoDB for reliable, isolated tests
- 🔒 **CORS & Logging** — Cross-origin support via `cors` and HTTP request logging via `morgan`
- 🏗️ **TypeScript** — Fully typed, strict-mode codebase compiled to ES6

---

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| Runtime | Node.js |
| Language | TypeScript 5 |
| Framework | Express 5 |
| Database | MongoDB (via Mongoose 8) |
| HTTP Client | Axios |
| Date Utilities | date-fns |
| Email | Nodemailer |
| Testing | Jest, Supertest, mongodb-memory-server |
| Logging | Morgan |
| Config | dotenv |
| Build | tsc (TypeScript compiler) |

---

## 🔄 How It Works

The core scan flow is designed to work alongside [LocationJS](https://github.com/asomaniKofi/LocationJS):

1. The user sets their location in the front-end app
2. **LocationJS** resolves the user's area and council from their location
3. The user scans a product barcode in **ScanMyTrash**
4. The front-end sends the barcode and area to **TrashScannerAPI's** `/scan` endpoint
5. The API looks up the product in the product database by barcode — returns `404` if not found
6. The API fetches bin collection data for the given area — returns `404` if not found
7. The core `ScanTrash()` function loops through all bins and checks whether any bin's contents include the product's material
8. If a match is found, the API returns a `200` response with the disposal details
9. If no match is found, a `404` is returned with a prompt to try a different product

### Response Shape

A successful `/scan` response returns a JSON object with the following shape:

```json
{
  "ProductName": "string",
  "BinName": "string",
  "Material": "string",
  "BinDate": "string",
  "BinOccurrence": "number"
}
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node.js)
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster (or local MongoDB instance)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/asomaniKofi/TrashScannerAPI.git
   cd TrashScannerAPI
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the project root:

   ```env
   MONGO_URL=<your_mongodb_connection_string>
   GMAIL=<your_gmail_address>
   GMAIL_PASSWORD=<your_gmail_app_password>
   PORT=<port_number>
   ```

   > ⚠️ **Never commit your `.env` file to version control.** Ensure it is listed in `.gitignore`.

4. **Build and start the server**

   ```bash
   npm start
   ```

   For development with auto-recompilation:

   ```bash
   npm run dev
   ```

---

## 🧪 Running Tests

The test suite uses Jest and Supertest against an in-memory MongoDB instance — no live database connection needed.

```bash
npm test
```

---

## 📁 Project Structure

```
TrashScannerAPI/
├── src/                    # TypeScript source code
│   └── index.ts            # Application entry point & Express server
├── out/                    # Compiled JavaScript output (generated)
├── pseudosolution.jsonc    # Design notes & API flow documentation
├── .gitignore
├── jest.config.ts          # Jest configuration
├── tsconfig.json           # TypeScript configuration
└── package.json
```

---

## 📜 Available Scripts

| Script | Description |
|---|---|
| `npm start` | Compiles TypeScript and starts the server |
| `npm run dev` | Watches for changes and recompiles TypeScript |
| `npm run build` | Compiles TypeScript to `out/` |
| `npm test` | Runs the Jest integration test suite |

---

## 🔗 Related Repositories

This API is part of a wider ecosystem of projects:

- [**ScanMyTrash**](https://github.com/asomaniKofi/ScanMyTrash) — The React front-end that consumes this API, featuring barcode scanning and AI object detection
- [**LocationJS**](https://github.com/asomaniKofi/LocationJS) — The companion API for resolving council/area data from a user's location

---

## 🔒 Security Notes

- Store all sensitive credentials (MongoDB URI, Gmail password) in a `.env` file — **never hardcode or commit them**.
- Ensure `.env` is included in `.gitignore`.
- For Gmail, use an [App Password](https://support.google.com/accounts/answer/185833) rather than your main account password.

---

## 🤝 Contributing

Contributions are welcome! To get started:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to your fork: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **ISC License**.

---

## 👤 Author

**asomaniKofi** — [GitHub Profile](https://github.com/asomaniKofi)

