# Deploying RIC Shoe Care to Google Cloud Run (`europe-west1`)

This project is configured to deploy to **Google Cloud Run** in the **`europe-west1` (Belgium)** region.

---

## Prerequisites

1. Install the [Google Cloud CLI (`gcloud`)](https://cloud.google.com/sdk/docs/install).
2. Authenticate and select your Google Cloud project:
   ```bash
   gcloud auth login
   gcloud config set project YOUR_GCP_PROJECT_ID
   ```
3. Enable the required GCP APIs:
   ```bash
   gcloud services enable run.googleapis.com cloudbuild.googleapis.com
   ```

---

## Option 1: Direct Source Deployment (Recommended)

Deploy directly from source using the provided deploy script or single `gcloud` command:

```bash
./deploy.sh
```

Or run the command manually:

```bash
gcloud run deploy ric-shoe-care \
  --source . \
  --region europe-west1 \
  --platform managed \
  --allow-unauthenticated \
  --port 3000
```

---

## Option 2: Automated Deployment via Cloud Build

If using Google Cloud Build, trigger the automated pipeline configured in `cloudbuild.yaml`:

```bash
gcloud builds submit --config cloudbuild.yaml
```

---

## Option 3: Via Google Cloud Console (Web UI)

1. Open [Google Cloud Console - Cloud Run](https://console.cloud.google.com/run).
2. Click **Create Service**.
3. Under **Deployment platform**: select **Cloud Run (fully managed)**.
4. Under **Region**: select **`europe-west1 (Belgium)`**.
5. Under **Authentication**: choose **Allow unauthenticated invocations**.
6. Under **Container > Port**: set the container port to **`3000`**.
7. Click **Create** to deploy.
