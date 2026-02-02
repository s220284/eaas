# CRITICAL ISSUES - MUST FIX

## ✅ RESOLVED: Character Creation API Bug

**Status:** RESOLVED - Fixed on 2026-02-02
**Severity:** Was Critical
**Impact:** Was preventing bulk upload system from working

### Description

The character creation API endpoint (`POST /api/v1/characters/`) is returning 404 "Franchise not found" even when:
- The franchise exists in the database
- The franchise belongs to the correct organization
- The franchise_id is passed correctly
- Direct SQL queries confirm the franchise is accessible

### Reproduction

```bash
# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"peppapig@demo.canonsafe.com","password":"Peppa"}'

# Get franchises (works)
curl http://localhost:8000/api/v1/characters/franchises/ \
  -H "Authorization: Bearer $TOKEN"

# Create character (fails with 404)
curl -X POST http://localhost:8000/api/v1/characters/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "franchise_id": "8e3bcb1c-6839-4ec4-a054-f76482d836ec",
    "name": "Test Character",
    "slug": "test-character"
  }'
```

### Investigation Done

1. ✅ Verified franchise exists in database
2. ✅ Verified franchise belongs to correct organization
3. ✅ Verified user authentication works
4. ✅ Verified franchise list API returns correct data
5. ✅ Verified SQL query with same filters works
6. ❌ Character creation fails at franchise lookup (line 75-80 in src/api/characters.py)

### Suspected Root Cause

Likely one of:
1. Database session/transaction isolation issue
2. Type mismatch in franchise_id comparison (string vs UUID)
3. Async/await timing issue in FastAPI
4. Database connection pooling issue

### Location

File: `src/api/characters.py`
Lines: 75-80

```python
franchise = db.query(Franchise).filter(
    Franchise.id == card.franchise_id,
    Franchise.organization_id == current_user.organization_id,
).first()
if not franchise:
    raise HTTPException(status_code=404, detail="Franchise not found")
```

### Next Steps to Debug

1. Add detailed logging to the character creation endpoint
2. Log the actual SQL query being generated
3. Log franchise_id type and value
4. Log current_user.organization_id value
5. Check if database session is stale
6. Try with explicit session refresh before query
7. Check FastAPI's dependency injection for get_db()

### Workaround

Characters can be created directly via SQL for now:

```python
# Manual character creation via SQLAlchemy
from src.database import SessionLocal
from src.models import CharacterCard, CardVersion
# ... create character directly
```

### Impact on System

- ❌ Bulk upload system cannot create characters automatically
- ✅ All other functionality works (auth, franchises, data extraction, validation)
- ✅ Manual character creation via SQL works
- ✅ Once characters exist, evaluations work

### Resolution

**Root Causes Found:**

1. **UUID Type Mismatch in Queries** (src/api/characters.py lines 75-80)
   - Database models use `String(36)` for UUID storage
   - Pydantic schemas use `UUID` type
   - SQLAlchemy queries were comparing String columns with UUID objects
   - **Fix:** Convert UUID parameters to strings in all filter queries: `str(card.franchise_id)`

2. **Incorrect API Payload Format** (scripts/bulk_upload/api_client.py)
   - API was sending flat character data structure
   - Schema expects nested `initial_version` object
   - **Fix:** Restructured payload to nest version data under `initial_version`

3. **Schema Field Type Mismatch** (scripts/bulk_upload/api_client.py)
   - Sending `canon_relationships` as dict with numeric keys
   - Schema expects list of dicts with `{entity, relationship, notes}`
   - Sending `safety_prohibited_topics` as complex objects
   - Schema expects list of simple strings
   - **Fix:** Convert to correct list formats in API client

4. **UUID Binding to SQLite** (src/api/characters.py line 82)
   - Creating CharacterCard with UUID object for `franchise_id`
   - SQLite doesn't support UUID type, only strings
   - **Fix:** Convert UUID to string: `str(card.franchise_id)`

**Files Modified:**
- `src/api/characters.py` - Added str() conversion for all UUID parameters
- `scripts/bulk_upload/api_client.py` - Fixed payload structure and field formats

**Testing:**
- ✅ Franchise creation: WORKING
- ✅ Character creation via API: WORKING (5/5 characters created successfully)
- ✅ Bulk upload system: NOW FUNCTIONAL

### Priority Actions

1. ~~MUST FIX BEFORE PRODUCTION~~ ✅ RESOLVED
2. ~~Schedule dedicated debugging session~~ ✅ COMPLETED
3. Consider adding integration tests for character creation
4. ~~Review all similar API endpoints for same issue~~ ✅ DONE

---

**Created:** 2026-02-02
**Assigned:** Engineering Team
**Due Date:** Before production deployment
**Blocking:** Full bulk upload functionality

---

## Other Issues

(None currently)
