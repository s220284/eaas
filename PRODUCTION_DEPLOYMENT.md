# Production Deployment Instructions

**Last Updated**: 2026-02-02
**Status**: Ready to deploy

---

## What's Being Deployed

1. **Backend fixes**: Character creation bug fix + Data Quality API
2. **Frontend**: Data Quality Dashboard (infinite loop fixed)
3. **Demo data**: 5 Peppa Pig characters for Hasbro organization

---

## Prerequisites

- GCP Project: `mash-ai-prod`
- Authenticated with gcloud: `gcloud auth login`
- GitHub repo: https://github.com/s220284/eaas

---

## Step 1: Deploy Backend to Cloud Run

```bash
cd /Users/shellypalmer/s220284/EaaS

# Build and push Docker image to Google Container Registry
gcloud builds submit --tag gcr.io/mash-ai-prod/mash-ai-backend --project mash-ai-prod

# Deploy to Cloud Run
gcloud run deploy mash-ai-backend \
  --image gcr.io/mash-ai-prod/mash-ai-backend \
  --region us-central1 \
  --project mash-ai-prod \
  --allow-unauthenticated \
  --platform managed \
  --set-env-vars "ENVIRONMENT=production"
```

**Expected output**: Deployment URL (should be existing URL)
**Time**: ~5-8 minutes

---

## Step 2: Verify Backend Deployment

```bash
curl https://mash-ai-backend-611530284830.us-central1.run.app/health

# Should return: {"status":"healthy","database":"connected","version":"0.1.0"}
```

---

## Step 3: Deploy Frontend (Automatic via Vercel)

Frontend auto-deploys when you push to GitHub:

```bash
git push origin main
```

- Vercel will automatically build and deploy
- Check: https://eaas-mu.vercel.app
- Time: ~2-3 minutes

---

## Step 4: Load Peppa Pig Demo Data

```bash
cd /Users/shellypalmer/s220284/EaaS

# Set demo password as environment variable
export DEMO_PASSWORD="PeppaPig2026!"

# Run production data loader
source venv/bin/activate
python scripts/load_production_demo.py
```

**Expected output**:
```
Step 1: Creating Hasbro organization and admin user...
✓ Created Hasbro organization and demo user

Step 2: Creating Peppa Pig franchise...
✓ Created franchise

Step 3: Loading character data...
✓ Loaded 5 characters

Step 4: Creating characters...
  Creating: Peppa Pig... ✓
  Creating: George Pig... ✓
  Creating: Mummy Pig... ✓
  Creating: Daddy Pig... ✓
  Creating: Suzy Sheep... ✓

✓ Demo data loading complete!
```

---

## Step 5: Verify Production

### Test Login
1. Go to: https://eaas-mu.vercel.app
2. Click "Register" or use existing credentials
3. Demo account:
   - Email: peppapig@demo.canonsafe.com
   - Password: PeppaPig2026!

### Test Data Quality Dashboard
1. Log in
2. Click "Data Quality" in sidebar
3. Should see:
   - Overview: 5 total characters
   - Characters tab: Peppa, George, Mummy, Daddy, Suzy
   - Issues tab: Validation warnings

### Test Characters Page
1. Click "Characters" in sidebar
2. Should see all 5 Peppa Pig characters
3. Click on any character to see details

---

## Rollback (If Needed)

### Rollback Backend
```bash
# List revisions
gcloud run revisions list --service mash-ai-backend --region us-central1 --project mash-ai-prod

# Rollback to previous revision
gcloud run services update-traffic mash-ai-backend \
  --to-revisions PREVIOUS_REVISION=100 \
  --region us-central1 \
  --project mash-ai-prod
```

### Rollback Frontend
- Go to Vercel dashboard
- Select deployment
- Click "Promote to Production" on previous deployment

---

## Troubleshooting

### Backend won't deploy
**Error**: Authentication required
**Fix**: Run `gcloud auth login` and try again

**Error**: Permission denied
**Fix**: Ensure you have Cloud Run Admin role in mash-ai-prod project

### Data loader fails
**Error**: 500 Internal Server Error when creating characters
**Fix**: Ensure backend is deployed with latest code (Step 1 complete)

**Error**: "Franchise not found"
**Fix**: Script creates franchise automatically, check backend logs

### Frontend shows empty pages
**Possible causes**:
1. Backend not deployed → Check Step 1
2. No data loaded → Check Step 4
3. Authentication issues → Check browser console for errors

**Check backend health**:
```bash
curl https://mash-ai-backend-611530284830.us-central1.run.app/health
```

**Check if data exists**:
```bash
# Login and get token
TOKEN=$(curl -s -X POST https://mash-ai-backend-611530284830.us-central1.run.app/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"peppapig@demo.canonsafe.com","password":"PeppaPig2026!"}' \
  | jq -r '.access_token')

# Check characters
curl -s https://mash-ai-backend-611530284830.us-central1.run.app/api/v1/characters/ \
  -H "Authorization: Bearer $TOKEN" | jq 'length'

# Should return: 5
```

---

## Post-Deployment Checklist

- [ ] Backend health check passes
- [ ] Frontend loads without errors
- [ ] Can log in with demo account
- [ ] Characters page shows 5 characters
- [ ] Data Quality Dashboard shows metrics
- [ ] All 3 tabs work (Overview, Characters, Issues)

---

## Success Criteria

✅ All systems healthy
✅ Demo data visible and accessible
✅ Data Quality Dashboard functional
✅ No API errors in browser console
✅ All pages load successfully

---

## Next Steps After Deployment

1. **Change demo password** (currently exposed in Git history)
2. **Set up monitoring** (Cloud Monitoring/Logging)
3. **Configure alerts** for API errors
4. **Add more characters** (optional)
5. **Run evaluations** on characters to populate quality scores

---

**Questions?** Check SESSION_2026-02-02.md for detailed session log.
