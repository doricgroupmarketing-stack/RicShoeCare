# HostAfrica cPanel Deployment Guide for RIC Shoe Care

This guide explains how to deploy this Node.js web application to **HostAfrica cPanel** using **Git Version Control** or manual upload.

---

## Method A: Deploying with cPanel Git Version Control (Recommended)

### 1. Push to GitHub
Ensure your latest code, including the pre-built `dist/` folder and `.cpanel.yml`, is committed and pushed to your GitHub repository:
```bash
git add .
git commit -m "Deploy update"
git push origin main
```

### 2. Configure Node.js in cPanel
1. In cPanel, navigate to **Software** → **Setup Node.js App**.
2. Click **Create Application**:
   - **Node.js version**: `20.x` (or `18.x`)
   - **Application mode**: `Production`
   - **Application root**: `public_html` (this maps to `/home/ricshoec/public_html/`)
   - **Application URL**: select your domain / subdomain (e.g. `ricshoecare.co.za`)
   - **Application startup file**: `app.js`
3. Click **Create**.

### 3. Clone Repository in cPanel Git Version Control
1. In cPanel, navigate to **Files** → **Git Version Control**.
2. Click **Create**:
   - **Clone URL**: your GitHub repository URL (e.g., `https://github.com/doricgroup/RicShoeCare.git`)
   - **Repository Path**: `/home/ricshoec/public_html`
   - **Repository Name**: `public_html`
3. Click **Create**.

### 4. Deploy via .cpanel.yml
1. In **Git Version Control**, click **Manage** next to the repository.
2. Open the **Pull or Deploy** tab.
3. Click **Update from Remote** (to pull the latest commit from GitHub).
4. Click **Deploy HEAD Commit**.
   - The `.cpanel.yml` file will safely prepare the files in `/home/ricshoec/public_html/`, copy static assets for direct web serving, and touch `tmp/restart.txt` to trigger Phusion Passenger to reload.

### 5. Install NPM Packages
1. In cPanel, go back to **Setup Node.js App**.
2. Click the **Edit** (pencil) icon next to your app.
3. Click **Run NPM Install** (only needed on initial deploy or when adding new dependencies).
4. *(Optional)* Add environment variable `GEMINI_API_KEY` under **Environment variables** if using live AI diagnosis.
5. Click **Restart**. Your website is now live!

---

## Method B: Deploying via File Manager (ZIP Upload)

### Step 1: Export Your Project
1. In the AI Studio interface, click the **Settings** / Menu icon in the top right corner.
2. Click **Download ZIP**.
3. The downloaded ZIP contains:
   - `app.js` (the cPanel Phusion Passenger startup file)
   - `dist/` (pre-compiled frontend assets and backend server bundle)
   - `package.json`
   - `data/` (database and asset files)

---

## Step 2: Create the Node.js App in cPanel
1. Log in to your **HostAfrica Client Area** and click **Log in to cPanel**.
2. Scroll to the **Software** category and click **Setup Node.js App**.
3. Click the blue **Create Application** button:
   - **Node.js version**: Choose **20.x** (or the latest available: 18.x or 20.x).
   - **Application mode**: **Production**.
   - **Application root**: Enter `ricshoecare`.
   - **Application URL**: Select your domain from the dropdown.
   - **Application startup file**: Enter **`app.js`**.
4. Click **Create** (top right).

---

## Step 3: Upload Files via File Manager
1. In cPanel, navigate to **File Manager**.
2. Open `/home/ricshoec/ricshoecare/`.
3. Click **Upload** and upload the ZIP file.
4. Extract the ZIP directly into this folder.
5. Ensure `app.js`, `package.json`, `dist/`, and `data/` are located directly in `/home/ricshoec/ricshoecare/`.

---

## Step 4: Run NPM Install & Restart
1. Go to **Setup Node.js App** → Edit your app.
2. Click **Run NPM Install**.
3. Click **Restart**.
4. Click **Open URL** to test your live website!

