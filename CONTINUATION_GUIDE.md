# EaaS - Continuation Guide

Quick reference for resuming work on this project.

---

## Startup Commands

```bash
# 1. Check git status
git status

# 2. Check for running processes
ps aux | grep python

# 3. Run tests (when they exist)
pytest -v
```

---

## State Verification

1. Read PROJECT_STATE.md for current status
2. Read SESSION_LOG.md for recent work and next steps
3. Check git log for recent commits: `git log --oneline -5`

---

## Key Workflows

### Adding a New Feature
1. Update SESSION_LOG.md with what you're starting
2. Implement the feature
3. Write tests
4. Run tests: `pytest -v`
5. Commit with descriptive message
6. Update PROJECT_STATE.md if needed

### Fixing a Bug
1. Reproduce the bug
2. Write a failing test
3. Fix the bug
4. Verify test passes
5. Commit with `fix:` prefix

---

## Important Files

| File | Purpose |
|------|---------|
| CLAUDE.md | Main reference doc (read at session start) |
| PROJECT_STATE.md | Current system status |
| SESSION_LOG.md | Work history and next steps |

---

## Environment Setup

```bash
# Python virtual environment (if using Python)
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

---

*Update this file when workflows change*
