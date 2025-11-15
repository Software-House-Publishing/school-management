# Portal RBAC & Access Model

## Project Logic & Purpose
- GED combines campus management, learning management, and finance tooling. The backend (FastAPI + Supabase) exposes user, course, exam, announcement, fee, payment, and salary resources, each surfaced through dedicated React admin, teacher, and student panels.
- Students self-serve via a universal portal. Staff and teachers never self-register; they receive invitations from privileged operators and must authenticate with Google using Supabase Auth before receiving backend-issued JWTs.
- Frontend admin views (`frontend/src/pages/admin/*.tsx`) currently emphasise data visibility. To reach full CRUD parity, each page must honor the same RBAC rules enforced by backend dependencies and Supabase row-level security.

## Access Model
- **Invitation-only:** Director, Administrator, Manager, Finance Officer, Help Desk, and Teacher accounts are issued/activated exclusively through invitations (`POST /api/invitations`, `POST /api/invitations/accept`). Their portals unlock only after the invite is accepted.
- **Universal access:** Students authenticate directly with Google. They receive the student portal by default and cannot see staff portals.
- **Session composition:** Authentication responses should carry both the canonical backend role (`director`, `teacher`, etc.) and the collapsed UI role so that the React app can provide granular gating without losing legacy behaviour.

## Roles
- **Director** — executive owner; ultimate authority across people, academics, finance, and system policy.
- **Administrator** — platform operator; manages invitations, user lifecycle, academic structure, and acts as deputy to director.
- **Manager** — academic operations lead; coordinates courses, enrollment, exam logistics, and staffing assignments but not financials.
- **Finance Officer** — finance controller; owns billing, payments, payroll, and financial reporting.
- **Help Desk** — support agent; resolves user issues, manages announcements, and can soft-update profiles but lacks destructive or financial powers.
- **Teacher** — instructional staff; builds course content, manages their cohorts, schedules assessments, and communicates with learners within assigned courses. Invitation required.
- **Student** — learner; interacts with assigned courses, schedules, exams, fees, and announcements. Automatically provisioned on successful Supabase sign-in.

## Permission Matrix
| Module / Operation | Director | Administrator | Manager | Finance Officer | Help Desk | Teacher | Student |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Platform dashboard analytics | ✅ | ✅ | ✅ | ✅ | ✅ |  |  |
| User directory: list/search | ✅ | ✅ | ✅ | ✅ | ✅ |  |  |
| User profile: create invite | ✅ | ✅ | ✅ |  |  |  |  |
| User profile: resend/revoke invite | ✅ | ✅ | ✅ |  |  |  |  |
| User role reassignment | ✅ | ✅ |  |  |  |  |  |
| User status suspend/restore | ✅ | ✅ | ✅ |  | ✅ |  |  |
| Self profile update | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Courses: create | ✅ | ✅ | ✅ |  |  | ✅ |  |
| Courses: read | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Courses: update | ✅ | ✅ | ✅ |  |  | ✅ |  |
| Courses: archive/delete | ✅ | ✅ |  |  |  |  |  |
| Enrollment management (assign/remove students) | ✅ | ✅ | ✅ |  |  | ✅ |  |
| Enrollment codes: generate/revoke | ✅ | ✅ | ✅ |  |  | ✅ |  |
| Teacher assignment to courses | ✅ | ✅ | ✅ |  |  |  |  |
| Exams: create/update | ✅ | ✅ | ✅ |  |  | ✅ |  |
| Exams: grade & publish | ✅ | ✅ | ✅ |  |  | ✅ |  |
| Exams: sit & view results |  |  |  |  |  |  | ✅ |
| Announcements: create/send | ✅ | ✅ | ✅ |  | ✅ | ✅ |  |
| Announcements: edit/delete | ✅ | ✅ | ✅ |  | ✅ |  |  |
| Announcements: receive/view | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Fees: create/update/delete plans | ✅ |  |  | ✅ |  |  |  |
| Fees: read | ✅ | ✅ | ✅ | ✅ | ✅ |  | ✅ |
| Payments: record/update/delete | ✅ |  |  | ✅ |  |  |  |
| Payments: read/export | ✅ | ✅ | ✅ | ✅ | ✅ |  | ✅ |
| Salaries: create/update/delete runs | ✅ |  |  | ✅ |  |  |  |
| Salaries: read/export | ✅ | ✅ | ✅ | ✅ | ✅ |  |  |
| Reports: export CSV/PDF | ✅ | ✅ | ✅ | ✅ |  |  |  |
| Support tickets: view | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Support tickets: resolve/escalate | ✅ | ✅ | ✅ |  | ✅ |  |  |
| System settings (branding, integrations) | ✅ | ✅ |  |  |  |  |  |
| Invitation policy configuration | ✅ | ✅ |  |  |  |  |  |
| Route access: `/admin/*` | ✅ | ✅ | ✅ | ✅ | ✅ |  |  |
| Route access: `/teacher/*` |  |  |  |  |  | ✅ |  |
| Route access: `/student/*` |  |  |  |  |  | ✅ | ✅ |

## Permission Scopes & Enforcement Checklist
- **Invitation pipeline**
	- Only Director, Administrator, and Manager can issue invites for any staff role. Teachers cannot invite other users. Acceptance endpoint must validate invitation token, intended role, and email domain if enforced.
	- Ensure backend denormalises invitation metadata into audit logs for traceability.
- **User lifecycle**
	- Suspend/restore endpoints permit Director, Administrator, Manager, Help Desk. Hard delete restricted to Director and Administrator, with double confirmation on UI.
	- Maintain immutable audit fields (`created_by`, `last_modified_by`).
- **Academic operations**
	- Managers and Teachers can create/update course content, generate enrollment codes, and manage enrollments, but only within scope (Teachers limited to courses they own/are assigned to).
	- Grade submission endpoints must confirm teacher ownership before accepting changes.
- **Financial operations**
	- Finance Officer controls CRUD on fees, payments, and salaries. Director retains override powers; other roles receive read-only views.
	- Align Supabase RLS policies so only finance roles can mutate finance tables.
- **Communications and support**
	- Help Desk publishes operational announcements and can modify content post-publication for incident response.
	- All authenticated users can open support tickets; only support-aligned roles resolve them.
- **Settings & integrations**
	- Restrict configuration endpoints (branding, third-party tokens, Supabase keys) to Director and Administrator. Provide UI guardrails and backend checks with explicit 403 responses.

## Implementation Notes
- **Preserve canonical roles:** `useAuthStore` currently maps multiple backend roles to broad UI categories. Extend the auth slice to store `rawRole` alongside `role`, and update all route guards/components to consult the raw role when enforcing fine-grained permissions.
- **Route permissions:** Expand `ROUTE_PERMISSIONS` in `frontend/src/utils/routes.ts` to include `director`, `administrator`, `manager`, `finance_officer`, `help_desk`, `teacher`, and `student`, keeping invitation-only portals segregated.
- **UI gating:** Each admin/teacher page should enable mutation buttons only when the signed-in role has the correct scope (e.g., show “Create User” button solely to Director/Administrator/Manager). Add inline tooltips describing required role when controls are disabled.
- **Backend parity:** Mirror this table in FastAPI dependencies and Supabase RLS policies. Every mutating endpoint must inspect the canonical role claims in the Supabase JWT and deny unauthorized access. Log all denied attempts for security review.
- **Auditing:** Record `performed_by` and `target_role` on invitation issuance, role reassignment, and financial updates. Consider weekly digest reports for directors summarising privileged actions.
- **Testing:** Add integration tests that simulate each role’s JWT against critical endpoints (invitation issue, course update, finance mutation) to prevent regressions as the RBAC matrix evolves.
