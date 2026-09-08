# RIC Shoe Care 👟✨

Premium AI-powered shoe cleaning, restoration, and care web application with intelligent diagnosis, 3D interactive shoe viewer, booking system, e-commerce shop, and admin portal.

---

## 🌟 Key Features

- **AI Shoe Diagnosis**: Upload a footwear photo to diagnose stains, scuffs, and material condition with custom treatment recommendations powered by Google Gemini.
- **Interactive 3D Shoe Viewer**: 360-degree interactive 3D sneaker visualization using Three.js and React Three Fiber.
- **Service Booking & Quotation**: Interactive service calculator and instant booking scheduler.
- **Product Shop & Inventory**: Browse shoe care products with real-time stock and cart management.
- **Admin Management Portal**: Order management, inventory editor, CMS page customizer, and operational analytics.
- **Deployment-Ready**: Pre-configured for standard Node.js hosting, HostAfrica cPanel (via Phusion Passenger), and Google Cloud Run containers.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Three.js / React Three Fiber
- **Backend**: Node.js, Express, Local File Store persistence
- **AI Integration**: `@google/genai` (Google Gemini API)
- **Bundler & Tooling**: Vite 6, esbuild, tsx

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Node.js 18+ or 20+ installed
- npm (included with Node.js)

### 2. Installation
```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/ric-shoe-care.git
cd ric-shoe-care

# Install dependencies
npm install
```

### 3. Environment Setup (Optional)
Copy the environment example file:
```bash
cp .env.example .env
```
Add your Gemini API key if you wish to use live AI diagnosis (optional; a fallback diagnosis flow runs if no key is provided):
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Production Build & Run

To build the client and bundle the server:
```bash
npm run build
npm start
```
The server will boot from `dist/server.cjs` serving the compiled SPA on port `3000` (or the port specified by `PORT`).

---

## 🌐 Deployment Options

### Option 1: HostAfrica / cPanel
This project includes an `app.js` entry point and Phusion Passenger socket detection specifically for cPanel's **Setup Node.js App** tool.
- Refer to [`CPANEL_DEPLOYMENT.md`](./CPANEL_DEPLOYMENT.md) for full step-by-step instructions.

### Option 2: Google Cloud Run
A production multi-stage Dockerfile and deployment scripts are located in `/deploy`.
- Refer to [`deploy/deploy.sh`](./deploy/deploy.sh) and [`deploy/cloudbuild.yaml`](./deploy/cloudbuild.yaml) for automated container deployments.

---

## 📄 License
MIT License
