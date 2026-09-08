# HostAfrica cPanel Deployment Guide for RIC Shoe Care

This guide explains how to deploy this Node.js web application to **HostAfrica cPanel** using the built-in **"Setup Node.js App"** tool.

---

## Step 1: Export Your Project
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
   - **Application root**: Enter a directory name, e.g. `ric-app` (or your domain folder).
   - **Application URL**: Select your domain from the dropdown (e.g. `yourdomain.co.za` or `subdomain.yourdomain.co.za`).
   - **Application startup file**: Enter **`app.js`**.
4. Click **Create** (top right).
5. cPanel will generate a virtual environment and show an application card.

---

## Step 3: Upload Files via File Manager
1. In cPanel, navigate to **File Manager** (under Files).
2. Open the application folder you created in Step 2 (e.g. `/home/username/ric-app`).
3. Click **Upload** in the top toolbar.
4. Upload the project ZIP file.
5. Once uploaded, right-click the ZIP file and click **Extract**.
6. Ensure that `app.js`, `package.json`, `dist/`, and `data/` are directly inside your application root folder (not nested in an extra subfolder).

---

## Step 4: Run NPM Install & Configure Environment
1. Return to cPanel → **Setup Node.js App**.
2. Click the **Edit** (pencil) icon next to your app.
3. Click the **Run NPM Install** button.
   *(Wait 1–2 minutes for packages to finish installing)*.
4. (Optional) Under **Environment variables**:
   - Click **Add Variable**:
     - Name: `GEMINI_API_KEY`
     - Value: your Gemini API key (for the AI Shoe Diagnosis feature).
5. Click **Save** and then click **Restart** at the top.

---

## Step 5: Test Your Website
Click **Open URL** or navigate to your domain in your browser. Your site should now load cleanly!
