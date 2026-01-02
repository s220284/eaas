# EaaS - Claude Code Reference

**Auto-loaded by Claude Code at session start**

---

## Project Overview

Managed Evals-as-a-Service

---

## Context Window Management

### Session Continuity Protocol

**Problem**: Long sessions lose context. Multi-session work loses state.

**Solution**: Structured documentation that persists across sessions.

**Required Files**:

| File | Purpose | When to Update |
|------|---------|----------------|
| `PROJECT_STATE.md` | Current system status, what's working | After each feature completion |
| `SESSION_LOG.md` | Detailed work tracking, decisions made | Every session, append-only |
| `CONTINUATION_GUIDE.md` | Quick-start commands for resuming work | When workflow changes |

### Session Startup Protocol

**1. Read these first (in order):**
```
PROJECT_STATE.md      → Current system status
SESSION_LOG.md        → Recent work and next steps
CONTINUATION_GUIDE.md → Quick start commands
```

**2. Check current state:**
```bash
git status                  # Uncommitted changes?
ls -la *.py 2>/dev/null     # What scripts exist?
```

### End-of-Session Checklist

1. [ ] Update `SESSION_LOG.md` with work completed
2. [ ] Check for uncommitted changes: `git status`
3. [ ] If changes made, commit with descriptive message
4. [ ] Note any running background jobs
5. [ ] List next steps in SESSION_LOG.md

---

## CRITICAL: Shell Script Line Endings

**BLOCKING REQUIREMENT**

The Write tool adds Windows-style CRLF line endings (`\r\n`) which break shell scripts on macOS/Linux.

**MANDATORY workflow for ALL .sh files:**

1. Write the shell script using Write tool
2. **IMMEDIATELY** fix line endings: `sed -i '' 's/\r$//' script.sh`
3. Make executable: `chmod +x script.sh`
4. Test: `./script.sh`

**This is NON-NEGOTIABLE. Skipping step 2 causes "bad interpreter" errors.**

---

## MANDATORY ENGINEERING WORKFLOW

### The Three Pillars

Every production code change MUST include ALL THREE:

1. **TESTS** - Comprehensive unit tests that prove functionality
2. **DOCUMENTATION** - Clear docstrings and comments for complex logic
3. **GIT COMMITS** - Proper version control with descriptive messages

### Testing Requirements

- Write tests BEFORE or WITH implementation
- Use pytest for Python code
- Aim for >80% code coverage
- Test success paths AND failure paths
- Mock external dependencies

```bash
pytest test_my_feature.py -v
# Must see: ====== X passed in X.XXs ======
```

### Documentation Requirements

- Add module-level docstrings explaining purpose
- Add function docstrings (Args, Returns, Raises)
- Add inline comments for complex logic only

```python
def process_data(input_data: dict) -> dict:
    """
    Process raw input data and return formatted output.

    Args:
        input_data: Dictionary containing raw data fields

    Returns:
        Formatted data dictionary with processed fields

    Raises:
        ValueError: If required fields are missing
    """
```

### Git Commit Requirements

- Commit after each logical unit of work
- Write descriptive commit messages
- Use conventional commits format

```bash
git commit -m "feat: Add data processing pipeline

- Implemented process_data() with validation
- Added error handling for missing fields
- Created 5 unit tests for edge cases"
```

### The Workflow

1. **Plan** - Understand requirements, design solution
2. **Implement** - Write the code
3. **Test** - Write and run comprehensive tests
4. **Document** - Add docstrings and comments
5. **Verify** - Run tests, review code
6. **Commit** - Git commit with descriptive message

**NO EXCEPTIONS. NO SHORTCUTS.**

---

## Code Conventions

- Files: `snake_case.py`
- Classes: `PascalCase`
- Functions: `snake_case`
- Use type hints for function signatures
- Use pathlib for file operations

---

## File Structure

```
EaaS/
├── CLAUDE.md              # THIS FILE - session quick ref
├── PROJECT_STATE.md       # System status
├── SESSION_LOG.md         # Work tracking
├── CONTINUATION_GUIDE.md  # Resume commands
├── src/                   # Source code
├── tests/                 # Test files
├── docs/                  # Documentation
├── scripts/               # Utility scripts
└── .gitignore             # Git ignore rules
```

---

## Quick Command Reference

| Task | Command |
|------|---------|
| Run tests | `pytest -v` |
| Check coverage | `pytest --cov=src` |
| Git status | `git status` |
| View recent commits | `git log --oneline -10` |

---

## Context Preservation Tips

### For Long Sessions

1. **Use TodoWrite tool** - Track multi-step tasks
2. **Commit frequently** - Git preserves state
3. **Update SESSION_LOG.md** - Document decisions

### For Multi-Session Work

1. **Read docs on startup** - PROJECT_STATE.md first
2. **Check git log** - Understand recent changes
3. **Review SESSION_LOG.md** - Pick up where left off

### Avoid Context Bloat

1. **Process incrementally** - Don't load everything at once
2. **Summarize findings** - Don't repeat raw data
3. **Use structured storage** - Database over memory

---

## Related Documentation

- `docs/ARCHITECTURE.md` - System design decisions
- `docs/API.md` - API reference (if applicable)

---

*Last updated: 2026-01-01 - Initial creation*
