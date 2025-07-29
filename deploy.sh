#!/bin/bash

# EasyDoctor API Deployment Script for Google Cloud Platform
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 EasyDoctor API - Google Cloud Deployment${NC}"
echo "=============================================="

# Check if required tools are installed
command -v gcloud >/dev/null 2>&1 || { echo -e "${RED}❌ gcloud CLI is required but not installed. Please install it first.${NC}" >&2; exit 1; }

# Set default values
PROJECT_ID=""
REGION="us-central1"
SERVICE_NAME="easydoctor-api"

# Get project ID
echo -e "${YELLOW}📋 Setting up project configuration...${NC}"
if [ -z "$PROJECT_ID" ]; then
    echo "Please enter your Google Cloud Project ID:"
    read -r PROJECT_ID
fi

# Set the project
gcloud config set project "$PROJECT_ID"

echo -e "${GREEN}✅ Project set to: $PROJECT_ID${NC}"

# Enable required APIs
echo -e "${YELLOW}🔧 Enabling required Google Cloud APIs...${NC}"
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Get MongoDB URL
echo -e "${YELLOW}🗄️  Database Configuration${NC}"
echo "Please enter your MongoDB connection string (e.g., mongodb+srv://user:pass@cluster.mongodb.net/dbname):"
read -r MONGODB_URL

# Get JWT Secret
echo "Please enter your JWT secret (or press Enter to use default):"
read -r JWT_SECRET
if [ -z "$JWT_SECRET" ]; then
    JWT_SECRET="SECRET#123"
fi

# Create substitutions file for Cloud Build
cat > cloudbuild-substitutions.yaml << EOF
substitutions:
  _JWT_SECRET: '$JWT_SECRET'
  _MONGODB_URL: '$MONGODB_URL'
EOF

echo -e "${GREEN}✅ Configuration saved to cloudbuild-substitutions.yaml${NC}"

# Submit build
echo -e "${YELLOW}🏗️  Starting Cloud Build...${NC}"
gcloud builds submit --config=cloudbuild.yaml --substitutions-from-file=cloudbuild-substitutions.yaml

# Get service URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format="value(status.url)")

echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo -e "${GREEN}📡 Your API is available at: $SERVICE_URL${NC}"
echo -e "${GREEN}🏥 Health check: $SERVICE_URL/api/health${NC}"

# Clean up substitutions file (contains sensitive info)
rm -f cloudbuild-substitutions.yaml

echo -e "${YELLOW}⚠️  Remember to:${NC}"
echo "   1. Update your frontend URLs to point to: $SERVICE_URL"
echo "   2. Configure your MongoDB to allow connections from Cloud Run"
echo "   3. Set up proper authentication if needed (remove --allow-unauthenticated)"
echo "   4. Monitor your application in the Google Cloud Console"