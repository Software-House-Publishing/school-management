# Calendar and Timetable Management

This document describes the Calendar and Timetable Management features available in the School Admin portal.

---

## Overview

The School Admin portal includes two management pages for scheduling:

1. **Calendar Management** (`/school-admin/calendar`) - Manage academic events, holidays, exams, and deadlines
2. **Timetable Management** (`/school-admin/timetable`) - Manage class schedules and room allocations

---

## Calendar Management

### Location
- **Route**: `/school-admin/calendar`
- **Component**: `src/pages/admin/calendar/AdminCalendar.tsx`
- **Navigation**: Sidebar > Calendar

### Features

#### View Modes
The calendar supports three view modes:
- **Today View**: Shows events for the current day
- **Month View**: Full calendar grid with day-by-day event display
- **Agenda View**: List of all events in the current month

#### Event Types
Events are categorized by type, each with a distinct color:
| Type | Color | Description |
|------|-------|-------------|
| Holiday | Rose/Red | Public holidays and school closures |
| Exam | Amber/Yellow | Examination dates |
| Deadline | Purple | Assignment and paper submission deadlines |
| Academic | Sky Blue | General academic events |

#### Event Sources
- **Public**: Public holidays visible to all
- **School**: School-specific academic dates

#### CRUD Operations

**Create Event**
1. Click "Add Event" button in header
2. Fill in event details:
   - Title (required)
   - Date (required)
   - Event Type
   - Source (Public/School)
   - Description (optional)
3. Click "Create"

**Edit Event**
1. Click on an event in any view
2. Click the pencil icon
3. Modify event details
4. Click "Update"

**Delete Event**
1. Click on an event in any view
2. Click the trash icon
3. Confirm deletion

#### Filtering
- Toggle "Holidays" to show/hide public holidays
- Toggle "Academic" to show/hide school events

### Data Structure

```typescript
type CalendarEvent = {
  id: string
  title: string
  date: string // YYYY-MM-DD format
  type: "holiday" | "academic" | "exam" | "deadline"
  source?: "public" | "school"
  description?: string
}
```

---

## Timetable Management

### Location
- **Route**: `/school-admin/timetable`
- **Component**: `src/pages/admin/timetable/AdminTimetable.tsx`
- **Navigation**: Sidebar > Timetable Management

### Features

#### View Modes
- **Week View**: Visual grid showing all classes across the week (8 AM - 6 PM)
- **List View**: Organized list of classes grouped by day

#### Statistics Dashboard
The header displays quick stats:
- Total number of classes
- Number of instructors
- Rooms in use
- Total weekly hours

#### CRUD Operations

**Create Schedule**
1. Click "Add Schedule" button
2. Fill in details:
   - Course Code (required)
   - Course Name (required)
   - Instructor (required)
   - Room (required)
   - Day of Week
   - Start Time
   - End Time
   - Color (for visual distinction)
3. Click "Create"

**Edit Schedule**
1. Click on a class block in week view, or click the pencil icon in list view
2. Modify details
3. Click "Update"

**Delete Schedule**
1. Click the trash icon on a schedule entry
2. Confirm deletion

#### Color Coding
8 color options are available for visual organization:
- Blue, Green, Purple, Amber, Rose, Cyan, Orange, Indigo

### Data Structure

```typescript
type TimetableEntry = {
  id: string
  courseCode: string
  courseName: string
  instructor: string
  room: string
  dayOfWeek: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday"
  startTime: string // HH:MM format
  endTime: string // HH:MM format
  color: string
}
```

---

## Navigation Configuration

Both features are added to the admin sidebar in `src/config/navigation.tsx`:

```typescript
{
  id: 'calendar',
  label: 'Calendar',
  href: '/school-admin/calendar',
  icon: <Calendar size={18} />,
  section: 'primary',
},
{
  id: 'timetable',
  label: 'Timetable Management',
  href: '/school-admin/timetable',
  icon: <Clock size={18} />,
  section: 'primary',
},
```

---

## Routes

Routes are defined in `src/App.tsx`:

```typescript
<Route path="calendar" element={<SchoolAdminCalendar />} />
<Route path="timetable" element={<SchoolAdminTimetable />} />
```

---

## Future Enhancements

Potential improvements for future development:
1. Backend API integration for persistent data storage
2. Recurring events support for calendar
3. Conflict detection for timetable (room/instructor overlaps)
4. Export functionality (PDF, CSV)
5. Drag-and-drop rescheduling
6. Integration with student/teacher portals
7. Notifications for upcoming events

---

*Last updated: January 2026*
