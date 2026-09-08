#!/bin/bash
set -e

SERVICE_NAME="ric-shoe-care"
REGION="europe-west1"
PORT=3000

echo "🚀 Deploying ${SERVICE_NAME} to Google Cloud Run in ${REGION}..."

gcloud run deploy "${SERVICE_NAME}" \
  --source . \
  --region "${REGION}" \
  --platform managed \
  --allow-unauthenticated \
  --port "${PORT}"

echo "✅ Deployment completed!"
