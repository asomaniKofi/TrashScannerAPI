# 🗑️ ScanMyTrash

**ScanMyTrash** is a React web application that helps users identify waste items and learn how to dispose of or recycle them correctly. It leverages barcode scanning and real-time object detection via your device's camera to classify trash items on the spot.

---

## ✨ Features

- 📷 **Barcode Scanning** — Scan product barcodes using your camera to identify items and get disposal guidance
- 🤖 **AI Object Detection** — Uses TensorFlow.js with the COCO-SSD model to identify waste items in real time without needing a barcode
- ♻️ **Recycling Guidance** — Provides disposal and recycling information based on the scanned or detected item
- 📱 **Responsive UI** — Built with Material UI and Tailwind CSS for a clean, mobile-friendly experience
- 🔀 **Multiple Scanning Backends** — Supports Quagga2, ZXing, and html5-qrcode for robust barcode detection across devices

---

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| Framework | React 19, TypeScript |
| Styling | Tailwind CSS, Material UI (MUI), Emotion |
| Barcode Scanning | Quagga2, ZXing, html5-qrcode |
| Object Detection | TensorFlow.js, COCO-SSD |
| Routing | React Router DOM v7 |
| UI Components | Radix UI, Lucide React, shadcn/ui |
| HTTP | Axios |
| Build Tool | Create React App (react-scripts) |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node.js)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/asomaniKofi/ScanMyTrash.git
   cd ScanMyTrash
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm start
   ```

   The app will open at [http://localhost:3000](http://localhost:3000).

### Build for Production

```bash
npm run build
```

The optimised production build will be output to the `build/` directory.

---

## 📁 Project Structure

```
ScanMyTrash/
├── public/          # Static assets and HTML template
├── src/             # Application source code
│   ├── components/  # Reusable UI components
│   ├── pages/       # Route-level page components
│   └── ...
├── build/           # Production build output
├── package.json
├── tsconfig.json
└── tailwind.config.js
```

---

## 🧠 How It Works

1. **Point your camera** at a product barcode or a piece of rubbish.
2. **ScanMyTrash scans** the barcode using one of several scanning libraries, or uses the COCO-SSD TensorFlow model to detect the object visually.
3. **The app identifies the item** and tells you whether it belongs in the recycling bin, general waste, or requires special disposal.

---

## 🤝 Contributing

Contributions are welcome! To get started:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit: `git commit -m "Add your feature"`
4. Push to your fork: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **ISC License**.

---

## 👤 Author

**asomaniKofi** — [GitHub Profile](https://github.com/asomaniKofi)
