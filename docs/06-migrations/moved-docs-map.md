# Documentation Migration Map

This document maps old documentation paths to their new locations after the restructuring.

---

## Migration Summary

| Date | Change Type | Files Affected |
|------|-------------|----------------|
| Jan 2026 | Restructure | 9 files reorganized |
| Jan 2026 | Merge | 3 files consolidated |
| Jan 2026 | New | 4 files created |

---

## Path Mappings

### Old → New Path Reference

| Old Path | New Path | Notes |
|----------|----------|-------|
| `docs/architecture/frontend-architecture.md` | `docs/02-architecture/frontend.md` | Retained, reorganized |
| `docs/architecture/workflow-architecture.md` | `docs/02-architecture/workflow.md` | Retained, reorganized |
| `docs/api/api-integration.md` | `docs/02-architecture/api-integration.md` | Moved to architecture |
| `docs/components/component-library.md` | `docs/04-ui/component-library.md` | Moved to UI section |
| `docs/development/setup-guide.md` | `docs/01-setup/quickstart.md` + `docs/01-setup/environment.md` | Split into two files |
| `docs/deployment/deployment-guide.md` | `docs/05-deployment/README.md` | Retained, reorganized |
| `docs/rbac.md` | `docs/03-auth-rbac/roles-permissions.md` | Moved to auth section |
| `docs/component-audit.md` | `docs/04-ui/component-audit.md` | Moved to UI section |
| `docs/ui-parity-matrix.md` | `docs/04-ui/patterns.md` | Merged into patterns |
| `docs/ui-patterns.md` | `docs/04-ui/patterns.md` | Merged with parity matrix |

---

## New Files Created

| New Path | Source | Purpose |
|----------|--------|---------|
| `docs/README.md` | New | Documentation entry point |
| `docs/00-overview/README.md` | New | Project overview |
| `docs/01-setup/quickstart.md` | Split from setup-guide.md | Quick start guide |
| `docs/01-setup/environment.md` | Split from setup-guide.md | Environment configuration |
| `docs/migrations/moved-docs-map.md` | New | This file |

---

## Deleted/Deprecated Files

The following old files can be safely deleted after migration:

```
docs/architecture/frontend-architecture.md  → DELETE
docs/architecture/workflow-architecture.md  → DELETE
docs/api/api-integration.md                → DELETE
docs/components/component-library.md       → DELETE
docs/development/setup-guide.md            → DELETE
docs/deployment/deployment-guide.md        → DELETE
docs/rbac.md                               → DELETE
docs/component-audit.md                    → DELETE
docs/ui-parity-matrix.md                   → DELETE
docs/ui-patterns.md                        → DELETE
```

---

## Content Merges

### setup-guide.md → quickstart.md + environment.md

The original setup guide was split:
- **quickstart.md**: Installation, demo login, basic usage
- **environment.md**: Detailed environment configuration, debugging

### ui-parity-matrix.md + ui-patterns.md → patterns.md

Combined into a single patterns guide:
- Feature parity matrix incorporated as reference table
- UI patterns documented with code examples
- Styling guidelines consolidated

---

## External References to Update

### Root README.md

Update documentation links:

```markdown
# Before
- [`docs/architecture/frontend-architecture.md`](docs/architecture/frontend-architecture.md)
- [`docs/components/component-library.md`](docs/components/component-library.md)
- [`docs/development/setup-guide.md`](docs/development/setup-guide.md)
- [`docs/api/api-integration.md`](docs/api/api-integration.md)
- [`docs/deployment/deployment-guide.md`](docs/deployment/deployment-guide.md)
- [`docs/rbac.md`](docs/rbac.md)

# After
- [`docs/02-architecture/frontend.md`](docs/02-architecture/frontend.md)
- [`docs/04-ui/component-library.md`](docs/04-ui/component-library.md)
- [`docs/01-setup/quickstart.md`](docs/01-setup/quickstart.md)
- [`docs/02-architecture/api-integration.md`](docs/02-architecture/api-integration.md)
- [`docs/05-deployment/README.md`](docs/05-deployment/README.md)
- [`docs/03-auth-rbac/roles-permissions.md`](docs/03-auth-rbac/roles-permissions.md)
```

### Code Comments

Search for any code comments referencing old paths:
- `grep -r "docs/architecture" src/`
- `grep -r "docs/development" src/`
- `grep -r "docs/rbac" src/`

---

## New Structure Overview

```
docs/
├── README.md                      # Entry point
├── 00-overview/
│   └── README.md                  # Project overview
├── 01-setup/
│   ├── quickstart.md              # Quick start
│   └── environment.md             # Environment config
├── 02-architecture/
│   ├── frontend.md                # Frontend architecture
│   ├── workflow.md                # Routing & workflows
│   └── api-integration.md         # API patterns
├── 03-auth-rbac/
│   └── roles-permissions.md       # RBAC specification
├── 04-ui/
│   ├── component-library.md       # Component reference
│   ├── patterns.md                # UI patterns
│   └── component-audit.md         # Audit report
├── 05-deployment/
│   └── README.md                  # Deployment guide
└── migrations/
    └── moved-docs-map.md          # This file
```

---

## Validation Checklist

After migration, verify:

- [ ] All new files exist and are readable
- [ ] Internal links work (relative paths)
- [ ] Root README links updated
- [ ] No broken references in code comments
- [ ] Old files deleted (optional)
- [ ] Table of contents in README.md accurate

---

*Last updated: January 2026*
