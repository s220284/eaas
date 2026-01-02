# MASH AI Deployment Guide

## Architecture

```
                    ┌─────────────────┐
                    │     Vercel      │
                    │   (Frontend)    │
                    │  React + Vite   │
                    └────────┬────────┘
                             │
                             │ HTTPS
                             ▼
                    ┌─────────────────┐
                    │   Cloud Run     │
                    │   (Backend)     │
                    │ FastAPI + Python│
                    └────────┬────────┘
                             │
                             │ Cloud SQL Proxy
                             ▼
                    ┌─────────────────┐
                    │   Cloud SQL     │
                    │  PostgreSQL     │
                    └─────────────────┘
```

## Prerequisites

1. **GCP Account** with billing enabled
2. **GitHub Account** for repository
3. **Vercel Account** (free tier works)
4. **gcloud CLI** installed locally

## Step 1: Push to GitHub

```bash
# Create new repo on GitHub (mash-ai or similar)
# Then push:
git remote add origin https://github.com/YOUR_USERNAME/mash-ai.git
git branch -M main
git push -u origin main
```

## Step 2: Set Up GCP

### Enable Required APIs

```bash
# Set your project ID
export PROJECT_ID=your-project-id
gcloud config set project $PROJECT_ID

# Enable APIs
gcloud services enable \
    cloudbuild.googleapis.com \
    run.googleapis.com \
    sqladmin.googleapis.com \
    secretmanager.googleapis.com
```

### Create Cloud SQL Instance

```bash
# Create PostgreSQL instance (this takes 5-10 minutes)
gcloud sql instances create mash-ai-db \
    --database-version=POSTGRES_15 \
    --tier=db-f1-micro \
    --region=us-central1 \
    --root-password=CHANGE_THIS_PASSWORD

# Create database
gcloud sql databases create mash_ai --instance=mash-ai-db

# Create user
gcloud sql users create mash_user \
    --instance=mash-ai-db \
    --password=CHANGE_THIS_PASSWORD
```

### Store Secrets in Secret Manager

```bash
# Store database URL
echo -n "postgresql://mash_user:PASSWORD@/mash_ai?host=/cloudsql/${PROJECT_ID}:us-central1:mash-ai-db" | \
    gcloud secrets create database-url --data-file=-

# Store JWT secret (generate a secure one)
openssl rand -hex 32 | gcloud secrets create jwt-secret --data-file=-

# Store API keys
echo -n "sk-your-openai-key" | gcloud secrets create openai-api-key --data-file=-
echo -n "sk-ant-your-anthropic-key" | gcloud secrets create anthropic-api-key --data-file=-
```

### Grant Cloud Run Access to Secrets

```bash
# Get the Cloud Run service account
export SA="${PROJECT_ID}@appspot.gserviceaccount.com"

# Grant access to secrets
gcloud secrets add-iam-policy-binding database-url \
    --member="serviceAccount:${SA}" --role="roles/secretmanager.secretAccessor"
gcloud secrets add-iam-policy-binding jwt-secret \
    --member="serviceAccount:${SA}" --role="roles/secretmanager.secretAccessor"
gcloud secrets add-iam-policy-binding openai-api-key \
    --member="serviceAccount:${SA}" --role="roles/secretmanager.secretAccessor"
gcloud secrets add-iam-policy-binding anthropic-api-key \
    --member="serviceAccount:${SA}" --role="roles/secretmanager.secretAccessor"

# Grant Cloud SQL access
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${SA}" --role="roles/cloudsql.client"
```

## Step 3: Deploy Backend to Cloud Run

### Option A: Manual Deploy

```bash
# Build and push image
gcloud builds submit --tag gcr.io/$PROJECT_ID/mash-ai-backend

# Deploy to Cloud Run
gcloud run deploy mash-ai-backend \
    --image gcr.io/$PROJECT_ID/mash-ai-backend \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated \
    --add-cloudsql-instances ${PROJECT_ID}:us-central1:mash-ai-db \
    --set-secrets DATABASE_URL=database-url:latest,SECRET_KEY=jwt-secret:latest,OPENAI_API_KEY=openai-api-key:latest,ANTHROPIC_API_KEY=anthropic-api-key:latest \
    --set-env-vars ENVIRONMENT=production,FRONTEND_URL=https://mash-ai.vercel.app
```

### Option B: Automated Deploy with Cloud Build

```bash
# Connect GitHub repo to Cloud Build (do this in GCP Console)
# Then set up trigger for main branch pushes

# The cloudbuild.yaml in this repo will handle the rest
```

After deployment, note the Cloud Run URL (e.g., `https://mash-ai-backend-xxxxx-uc.a.run.app`)

## Step 4: Deploy Frontend to Vercel

### Via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "Add New Project"
3. Import your GitHub repository
4. Set the **Root Directory** to `frontend`
5. Add environment variable:
   - `REACT_APP_API_URL` = `https://mash-ai-backend-xxxxx-uc.a.run.app` (your Cloud Run URL)
6. Click Deploy

### Via Vercel CLI

```bash
cd frontend
npm i -g vercel
vercel login
vercel --prod
```

## Step 5: Update CORS

After Vercel deployment, update the Cloud Run environment variable:

```bash
gcloud run services update mash-ai-backend \
    --region us-central1 \
    --set-env-vars FRONTEND_URL=https://your-app.vercel.app
```

## Step 6: Run Database Migrations

```bash
# Connect to Cloud SQL from local machine
gcloud sql connect mash-ai-db --user=mash_user

# Or use Cloud Run jobs for migrations
gcloud run jobs create mash-ai-migrate \
    --image gcr.io/$PROJECT_ID/mash-ai-backend \
    --region us-central1 \
    --set-cloudsql-instances ${PROJECT_ID}:us-central1:mash-ai-db \
    --set-secrets DATABASE_URL=database-url:latest \
    --command "alembic" \
    --args "upgrade,head"

gcloud run jobs execute mash-ai-migrate --region us-central1
```

## Environment Variables Reference

### Backend (Cloud Run)

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `SECRET_KEY` | JWT signing key (32+ chars) | Yes |
| `OPENAI_API_KEY` | OpenAI API key for evals | Yes |
| `ANTHROPIC_API_KEY` | Anthropic API key (optional) | No |
| `ENVIRONMENT` | `production` or `development` | Yes |
| `FRONTEND_URL` | Vercel URL for CORS | Yes |

### Frontend (Vercel)

| Variable | Description | Required |
|----------|-------------|----------|
| `REACT_APP_API_URL` | Cloud Run backend URL | Yes |

## Estimated Costs

- **Cloud SQL (db-f1-micro)**: ~$8/month
- **Cloud Run**: Pay per use, ~$0-20/month for light usage
- **Vercel**: Free tier (100GB bandwidth)
- **Total**: ~$10-30/month for MVP

## Troubleshooting

### CORS Errors
- Verify `FRONTEND_URL` matches your Vercel domain exactly
- Check Cloud Run logs: `gcloud run services logs read mash-ai-backend`

### Database Connection Issues
- Ensure Cloud SQL instance is running
- Verify Cloud SQL proxy is configured in Cloud Run
- Check secrets are accessible

### 502 Bad Gateway
- Check Cloud Run logs for startup errors
- Verify health check endpoint `/health` is working
- Increase memory/CPU if needed

## Local Development

```bash
# Backend
cd /path/to/EaaS
source venv/bin/activate
uvicorn src.main:app --reload --port 8000

# Frontend
cd frontend
npm start
```
