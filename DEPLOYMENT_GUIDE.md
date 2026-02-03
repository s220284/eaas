# Deployment Guide - CanonSafe

**Last Updated**: 2026-02-02
**Status**: Production deployment process verified and working

---

## Quick Reference

| Component | Command | Time |
|-----------|---------|------|
| Backend Deploy | `gcloud builds submit && gcloud run deploy` | ~5-8 min |
| Frontend Deploy | `git push origin main` (auto-deploys via Vercel) | ~2-3 min |
| Local Test | `npm start` in frontend/ with env var | Instant |

---

## Production Architecture

```
Frontend (Vercel)
  └─> https://eaas-mu.vercel.app
       └─> API calls to Backend

Backend (GCP Cloud Run)
  └─> https://mash-ai-backend-611530284830.us-central1.run.app
       └─> Cloud SQL PostgreSQL database
```

---

## Backend Deployment

### Step 1: Build Docker Image

```bash
cd /Users/shellypalmer/s220284/EaaS

gcloud builds submit \
  --tag gcr.io/mash-ai-prod/mash-ai-backend \
  --project mash-ai-prod
```

**Time**: ~5-8 minutes
**Output**: Docker image pushed to Google Container Registry

### Step 2: Deploy to Cloud Run

```bash
gcloud run deploy mash-ai-backend \
  --image gcr.io/mash-ai-prod/mash-ai-backend \
  --region us-central1 \
  --project mash-ai-prod \
  --allow-unauthenticated \
  --platform managed \
  --set-env-vars "ENVIRONMENT=production,FRONTEND_URL=https://eaas-mu.vercel.app"
```

**Time**: ~2-3 minutes
**Result**: New revision deployed, 100% traffic routed

### Step 3: Verify Backend

```bash
curl https://mash-ai-backend-611530284830.us-central1.run.app/health
# Should return: {"status":"healthy","database":"connected","version":"0.1.0"}
```

### Common Backend Issues

**Issue**: Build fails with "no credentials found"
**Fix**: Run `gcloud auth login` and authenticate

**Issue**: CORS errors from frontend
**Fix**: Ensure `FRONTEND_URL` env var is set in deployment (Step 2)

**Issue**: Database connection errors
**Fix**: Check Cloud SQL instance is running and `DATABASE_URL` secret is configured

---

## Frontend Deployment

### Step 1: Commit Changes

```bash
cd /Users/shellypalmer/s220284/EaaS

git add -A
git commit -m "feat: Your feature description"
git push origin main
```

**Time**: Instant
**Result**: Triggers automatic Vercel deployment

### Step 2: Monitor Vercel Deployment

1. Go to https://vercel.com/shellypalmers-projects/eaas/deployments
2. Watch for new deployment at top of list
3. Wait for status: "Ready" (green dot)
4. Deployment is live at https://eaas-mu.vercel.app

**Time**: ~2-3 minutes

### Step 3: Verify Frontend

```bash
curl https://eaas-mu.vercel.app
# Should return HTML with title "CanonSafe"
```

Test in browser:
1. Visit https://eaas-mu.vercel.app
2. Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
3. Test login

### Common Frontend Issues

**Issue**: "Network error - please check your connection"
**Fix**: Verify `REACT_APP_API_URL` env var is set in Vercel
**Check**: Settings → Environment Variables → `REACT_APP_API_URL`

**Issue**: Deployment stuck or failed
**Fix**: Check Vercel deployment logs, look for build errors

**Issue**: Old code still showing after deployment
**Fix**: Hard refresh browser, or clear browser cache

---

## Environment Variables

### Vercel (Frontend)

**Required**:
- `REACT_APP_API_URL` = `https://mash-ai-backend-611530284830.us-central1.run.app`
- Environment: ✓ Production

**Set via**: Vercel Dashboard → Settings → Environment Variables

### Cloud Run (Backend)

**Set via deployment command** (see Step 2 above):
- `ENVIRONMENT=production`
- `FRONTEND_URL=https://eaas-mu.vercel.app`

**Set via GCP Secret Manager**:
- `DATABASE_URL` - Cloud SQL connection string
- `SECRET_KEY` - JWT signing key
- `OPENAI_API_KEY` - For LLM evaluations

---

## Local Development

### Backend (Local)

```bash
cd /Users/shellypalmer/s220284/EaaS
source venv/bin/activate
uvicorn src.main:app --reload --port 8000
```

Access at: http://localhost:8000

### Frontend (Local)

```bash
cd /Users/shellypalmer/s220284/EaaS/frontend

# Connect to production backend
REACT_APP_API_URL=https://mash-ai-backend-611530284830.us-central1.run.app npm start

# Or connect to local backend
REACT_APP_API_URL=http://localhost:8000 npm start
```

Access at: http://localhost:3003

---

## Complete Deployment Workflow

### For Backend Changes

```bash
# 1. Make changes to backend code
# 2. Test locally
uvicorn src.main:app --reload --port 8000

# 3. Commit changes
git add -A
git commit -m "fix: Your backend fix"
git push origin main

# 4. Build and deploy
gcloud builds submit --tag gcr.io/mash-ai-prod/mash-ai-backend --project mash-ai-prod
gcloud run deploy mash-ai-backend \
  --image gcr.io/mash-ai-prod/mash-ai-backend \
  --region us-central1 \
  --project mash-ai-prod \
  --allow-unauthenticated \
  --platform managed \
  --set-env-vars "ENVIRONMENT=production,FRONTEND_URL=https://eaas-mu.vercel.app"

# 5. Verify
curl https://mash-ai-backend-611530284830.us-central1.run.app/health
```

### For Frontend Changes

```bash
# 1. Make changes to frontend code
# 2. Test locally
cd frontend
REACT_APP_API_URL=https://mash-ai-backend-611530284830.us-central1.run.app npm start

# 3. Build test (optional but recommended)
npm run build

# 4. Commit and push (triggers auto-deploy)
git add -A
git commit -m "feat: Your frontend feature"
git push origin main

# 5. Monitor Vercel deployment
# Visit: https://vercel.com/shellypalmers-projects/eaas/deployments

# 6. Verify
# Visit: https://eaas-mu.vercel.app
```

### For Full-Stack Changes

```bash
# 1. Make changes to both frontend and backend
# 2. Test locally with both running
# 3. Commit all changes
git add -A
git commit -m "feat: Full-stack feature"
git push origin main

# 4. Deploy backend first (so new API is ready)
gcloud builds submit --tag gcr.io/mash-ai-prod/mash-ai-backend --project mash-ai-prod
gcloud run deploy mash-ai-backend \
  --image gcr.io/mash-ai-prod/mash-ai-backend \
  --region us-central1 \
  --project mash-ai-prod \
  --allow-unauthenticated \
  --platform managed \
  --set-env-vars "ENVIRONMENT=production,FRONTEND_URL=https://eaas-mu.vercel.app"

# 5. Frontend auto-deploys from git push (already done in step 3)
# 6. Wait for both to complete, then verify
```

---

## Critical Configuration Notes

### CORS Configuration

**File**: `src/config.py`
**Critical**: Must explicitly list allowed origins. **Wildcards don't work!**

```python
@property
def all_cors_origins(self) -> list[str]:
    origins = self.cors_origins.copy()
    if self.frontend_url and self.frontend_url not in origins:
        origins.append(self.frontend_url)
    # Explicitly allow production Vercel domain
    if self.environment == "production":
        origins.append("https://eaas-mu.vercel.app")
    return origins
```

**Do NOT use**: `"https://*.vercel.app"` - this doesn't work in CORS!

### Environment Detection

Backend uses `ENVIRONMENT` env var:
- `development` - local development
- `production` - deployed to Cloud Run

Frontend uses `REACT_APP_API_URL`:
- Set in Vercel for production
- Set via command line for local dev

---

## Deployment Checklist

Before deploying to production:

**Backend**:
- [ ] All tests passing locally: `pytest -v`
- [ ] Health check works: `curl http://localhost:8000/health`
- [ ] Database migrations applied (if any)
- [ ] Environment variables configured in deployment command
- [ ] CORS allows production frontend domain

**Frontend**:
- [ ] Build succeeds locally: `npm run build`
- [ ] No ESLint errors
- [ ] `REACT_APP_API_URL` env var set in Vercel
- [ ] Tested with production backend locally

**After Deployment**:
- [ ] Backend health check: `curl https://mash-ai-backend-611530284830.us-central1.run.app/health`
- [ ] Frontend loads: Visit https://eaas-mu.vercel.app
- [ ] Login works
- [ ] Core features tested (characters, evaluations, dashboard)

---

## Useful Commands

```bash
# Check GCP project
gcloud config get-value project

# List Cloud Run services
gcloud run services list --region us-central1

# View Cloud Run logs
gcloud run services logs read mash-ai-backend --region us-central1 --limit 50

# Check Vercel deployments
vercel ls

# Force Vercel redeploy
git commit --allow-empty -m "chore: Trigger redeployment"
git push origin main

# Test API locally
curl http://localhost:8000/health

# Test API in production
curl https://mash-ai-backend-611530284830.us-central1.run.app/health
```

---

## Rollback Procedures

### Rollback Backend

```bash
# List revisions
gcloud run revisions list --service mash-ai-backend --region us-central1 --project mash-ai-prod

# Rollback to specific revision
gcloud run services update-traffic mash-ai-backend \
  --to-revisions REVISION_NAME=100 \
  --region us-central1 \
  --project mash-ai-prod
```

### Rollback Frontend

1. Go to https://vercel.com/shellypalmers-projects/eaas/deployments
2. Find previous working deployment
3. Click three dots (**⋯**)
4. Click **Promote to Production**

---

## Troubleshooting

### "Build failed" on GCP

- Check `gcloud` is authenticated: `gcloud auth login`
- Verify project is correct: `gcloud config get-value project`
- Check Dockerfile syntax
- Review Cloud Build logs in GCP Console

### "Service deployment failed" on Cloud Run

- Check environment variables are set
- Verify database connection string
- Check service logs: `gcloud run services logs read mash-ai-backend`

### "Network error" in production frontend

- Check `REACT_APP_API_URL` is set in Vercel
- Verify CORS is configured correctly in backend
- Hard refresh browser: `Cmd+Shift+R`
- Check browser console for actual error

### Database connection issues

- Verify Cloud SQL instance is running
- Check `DATABASE_URL` secret in GCP Secret Manager
- Ensure Cloud Run service has database access permissions

---

## Success!

Last successful deployment: **2026-02-02**
Backend: ✅ Cloud Run revision `mash-ai-backend-00005-8lg`
Frontend: ✅ Vercel deployment `8McABQE6Q`
Status: ✅ All systems operational

**Production URLs**:
- Frontend: https://eaas-mu.vercel.app
- Backend: https://mash-ai-backend-611530284830.us-central1.run.app
- Repo: https://github.com/s220284/eaas
