# Workflow & Routing Architecture

Multi-tenant routing, portal flows, login workflows, and exam approval processes.

---

## Multi-Tenant Architecture

### System Overview

```mermaid
graph TD
  subgraph "System Provider"
    SP_Web["System Landing & Marketing"]
    SP_Auth["System Login / Register"]
    SP_Admin["System Admin Portal"]
  end

  subgraph "School Tenant"
    School_X["Public Pages: /school/:schoolId/*"]
    School_Login["Login: /school/:schoolId/login"]
  end

  subgraph "Portals (Protected)"
    P_Student["/student/*"]
    P_Teacher["/teacher/*"]
    P_SchoolAdmin["/school-admin/*"]
    P_SystemAdmin["/system-admin/*"]
  end

  User((User)) --> SP_Web
  User --> School_X
  SP_Auth --> P_SystemAdmin
  SP_Auth --> P_SchoolAdmin
  School_Login --> P_Student
  School_Login --> P_Teacher
  School_Login --> P_SchoolAdmin
```

### Tenant Context

- **System Provider**: Platform owner manages global pages and school onboarding
- **School Tenant**: Each school has branded public pages under `/school/:schoolId`
- **Portals**: Role-specific protected routes (not tenant-prefixed in current implementation)

---

## Route Structure

### System Provider Routes (Public)

| Path | Component | Description |
|------|-----------|-------------|
| `/` | SystemHome | Platform landing page |
| `/about` | SystemAbout | About page |
| `/contact` | SystemContact | Contact form |
| `/pricing` | SystemPricing | Pricing plans |
| `/login` | SystemLogin | System login |
| `/register` | SystemRegister | School registration |
| `/forgot-password` | SystemForgotPassword | Password reset |
| `/docs` | SystemDocs | Documentation |
| `/help` | SystemHelp | Help center |
| `/status` | SystemStatus | System status |
| `/terms` | SystemTerms | Terms of service |
| `/privacy` | SystemPrivacy | Privacy policy |
| `/cookies` | SystemCookies | Cookie policy |
| `/gdpr` | SystemGDPR | GDPR compliance |

### School Public Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/school/:schoolId` | SchoolHome | School landing page |
| `/school/:schoolId/about` | SchoolAbout | School about page |
| `/school/:schoolId/contact` | SchoolContact | School contact |
| `/school/:schoolId/pricing` | SchoolPricing | School pricing |
| `/school/:schoolId/rules` | SchoolRules | School rules |
| `/school/:schoolId/login` | SchoolLogin | School-branded login |

### Student Portal (`/student/*`)

**Allowed Roles**: `student`

| Path | Component | Description |
|------|-----------|-------------|
| `/student/dashboard` | StudentDashboard | Student overview |
| `/student/qr-id` | StudentQRId | Virtual ID card |
| `/student/grades` | StudentGrades | Grade viewing |
| `/student/schedule` | StudentSchedule | Class schedule |
| `/student/courses` | StudentCourses | Enrolled courses |
| `/student/advisor` | StudentAdvisor | Academic advisor |
| `/student/assignments` | StudentAssignments | Assignments |
| `/student/fees` | StudentFees | Fee payments |
| `/student/calendar` | StudentCalendar | Academic calendar |
| `/student/exams` | StudentExams | Exam schedule |
| `/student/profile` | StudentProfile | Profile settings |

### Teacher Portal (`/teacher/*`)

**Allowed Roles**: `teacher`

| Path | Component | Description |
|------|-----------|-------------|
| `/teacher/dashboard` | TeacherDashboard | Teacher overview |
| `/teacher/courses` | TeacherCourses | Assigned courses |
| `/teacher/students` | TeacherStudents | Student roster |
| `/teacher/exams` | TeacherExams | Exam management |
| `/teacher/announcements` | TeacherAnnouncements | Announcements |

### School Admin Portal (`/school-admin/*`)

**Allowed Roles**: `school_administrator`, `manager`, `finance_officer`, `help_desk`

| Path | Component | Description |
|------|-----------|-------------|
| `/school-admin/dashboard` | AdminDashboard | Admin overview |
| `/school-admin/students` | StudentList | Student management |
| `/school-admin/students/new` | StudentCreate | Add student |
| `/school-admin/students/:id` | StudentDetail | Student details |
| `/school-admin/students/:id/edit` | StudentEdit | Edit student |
| `/school-admin/teachers` | TeacherList | Teacher management |
| `/school-admin/teachers/new` | TeacherCreate | Add teacher |
| `/school-admin/teachers/:id` | TeacherDetail | Teacher details |
| `/school-admin/courses` | AdminCourses | Course management |
| `/school-admin/announcements` | AdminAnnouncement | Announcements |
| `/school-admin/exams` | AdminExams | Exam management |
| `/school-admin/finance` | AdminFinance | Financial overview |
| `/school-admin/invoices` | AdminInvoices | Invoice management |
| `/school-admin/reports` | AdminReports | Reporting |
| `/school-admin/settings` | AdminSettings | School settings |

### System Admin Portal (`/system-admin/*`)

**Allowed Roles**: `system_administrator`

| Path | Component | Description |
|------|-----------|-------------|
| `/system-admin/dashboard` | SystemDashboard | Platform overview |
| `/system-admin/schools` | SchoolsPage | School management |
| `/system-admin/school-admins` | SchoolAdminsPage | Admin management |
| `/system-admin/users` | SystemUsersPage | User management |
| `/system-admin/roles` | RolesPermissionsPage | Role management |
| `/system-admin/announcements` | SystemAnnouncementsPage | Announcements |
| `/system-admin/reports` | SystemReportsPage | Reporting |
| `/system-admin/integrations` | IntegrationsPage | Third-party integrations |
| `/system-admin/audit-logs` | AuditLogsPage | Audit logs |
| `/system-admin/settings` | SystemSettingsPage | System settings |
| `/system-admin/support` | SupportCenterPage | Support center |
| `/system-admin/security` | SecurityPage | Security settings |
| `/system-admin/health` | SystemHealthPage | System health |

---

## Login Flows

### System Login (Platform Level)

Entry: `GET /login`

```mermaid
sequenceDiagram
  participant U as User
  participant UI as System Login UI
  participant Store as Auth Store
  U->>UI: Open /login
  U->>UI: Submit credentials
  UI->>Store: login(user, token)
  Store-->>UI: isAuthenticated=true
  UI->>U: Redirect to portal
```

### School Login (Tenant Level)

Entry: `GET /school/:schoolId/login`

```mermaid
sequenceDiagram
  participant U as User
  participant UI as School Login UI
  participant Store as Auth Store
  U->>UI: Open /school/:schoolId/login
  UI->>UI: Load branding by schoolId
  U->>UI: Submit email/password
  UI->>Store: login(user, token)
  Store-->>UI: isAuthenticated=true
  UI->>U: Redirect to portal
```

### Mock Authentication (Demo)

Email keywords determine role assignment:
- Contains `student` → student role
- Contains `teacher` → teacher role
- Contains `admin` → school_administrator role
- Contains `system` → system_administrator role

---

## Portal Flow

```mermaid
flowchart LR
  A[Login Success] --> B{Role}
  B -- student --> C["/student/dashboard"]
  B -- teacher --> D["/teacher/dashboard"]
  B -- school_administrator --> E["/school-admin/dashboard"]
  B -- system_administrator --> F["/system-admin/dashboard"]
```

---

## Route Protection

### ProtectedRoute Component

```tsx
<ProtectedRoute allowedRoles={['school_administrator', 'manager']}>
  <AdminLayout />
</ProtectedRoute>
```

### Protection Flow

```mermaid
flowchart LR
  A["Request Route"] --> B{Authenticated?}
  B -- No --> C["Redirect to /login"]
  B -- Yes --> D{Role Allowed?}
  D -- No --> E["Redirect to getDefaultRoute(role)"]
  D -- Yes --> F["Render Portal"]
```

---

## Exam/Quiz Approval Workflow

### Workflow Overview

```mermaid
flowchart TD
    subgraph Teacher["Teacher Portal"]
        T1[Create Question] --> T2{Question Type}
        T2 --> T2a[Multiple Choice]
        T2 --> T2b[True/False]
        T2 --> T2c[Short Answer]
        T2 --> T2d[Essay]
        T2a & T2b & T2c & T2d --> T3[Submit for Approval]

        T4[Create Exam] --> T5[Select Questions from Pool]
        T5 --> T6[Set Schedule & Duration]
        T6 --> T7[Submit for Approval]
    end

    subgraph Admin["School Admin Portal"]
        A1[Review Question] --> A2{Approve?}
        A2 -- Yes --> A3[Add to Course Question Pool]
        A2 -- No --> A4[Reject with Reason]

        A5[Review Exam] --> A6{Approve?}
        A6 -- Yes --> A7[Exam Published]
        A6 -- No --> A8[Reject with Reason]
    end

    subgraph Student["Student Portal"]
        S1[View Available Exams] --> S2{Current Time >= Start?}
        S2 -- No --> S3[Show Countdown]
        S2 -- Yes --> S4[Take Exam]
        S4 --> S5[Submit Answers]
        S5 --> S6[View Results when Graded]
    end

    T3 --> A1
    T7 --> A5
    A7 --> S1
```

### Question Types

| Type | Code | Auto-Grading |
|------|------|--------------|
| Multiple Choice | `multiple_choice` | Yes |
| True/False | `true_false` | Yes |
| Short Answer | `short_answer` | No |
| Essay | `essay` | No |

### Approval States

**Questions:**
```
[*] → pending → approved → [Question Pool]
              → rejected → (revise) → pending
```

**Exams:**
```
[*] → draft → pending_approval → approved → [Published]
                               → rejected → draft
```

### Time-Based Exam Visibility

Students can only see and take exams when:
1. Exam status is `approved`
2. Current time is >= `availableAt`
3. Current time is <= `endsAt`

---

## Session Management

### Authentication Store

```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
```

- Stored in localStorage under `auth-storage`
- Persists across page refreshes
- Cleared on logout

---

## Internationalization

### Supported Languages

| Language | Code | RTL |
|----------|------|-----|
| English | `en` | No |
| Burmese | `my` | Yes |

### Translation Files

- `src/i18n/locales/en.json`
- `src/i18n/locales/my.json`

---

## See Also

- [Frontend Architecture](./frontend.md) - Technical architecture
- [API Integration](./api-integration.md) - Backend patterns
- [Roles & Permissions](../03-auth-rbac/roles-permissions.md) - RBAC details
