# Timetable Planner - Backend API & Database Schema

This document provides the backend API endpoints and database schema for the Timetable Planner feature.

---

## Table of Contents

1. [Database Schema](#database-schema)
2. [API Endpoints](#api-endpoints)
3. [Validation Rules](#validation-rules)
4. [Conflict Messages](#conflict-messages)

---

## Database Schema

### PostgreSQL Schema

```sql
-- ============================================
-- TEACHER AVAILABILITY TABLES
-- ============================================

-- Teacher weekly availability template
CREATE TABLE teacher_availability_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    academic_year VARCHAR(20) NOT NULL,
    max_periods_per_day INTEGER DEFAULT 6,
    max_periods_per_week INTEGER DEFAULT 28,
    preferred_break_duration INTEGER DEFAULT 15, -- minutes
    prefer_consecutive_classes BOOLEAN DEFAULT false,
    avoid_first_period BOOLEAN DEFAULT false,
    avoid_last_period BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(teacher_id, school_id, academic_year)
);

-- Teacher availability slots (weekly recurring)
CREATE TABLE teacher_availability_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID NOT NULL REFERENCES teacher_availability_templates(id) ON DELETE CASCADE,
    day_of_week VARCHAR(10) NOT NULL CHECK (day_of_week IN ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('available', 'unavailable', 'preferred', 'avoid')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK (end_time > start_time)
);

-- Teacher availability exceptions (single date overrides)
CREATE TABLE teacher_availability_exceptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    exception_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('available', 'unavailable', 'preferred', 'avoid')),
    reason TEXT,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK (end_time > start_time)
);

-- ============================================
-- SCHOOL SCHEDULE CONFIGURATION
-- ============================================

CREATE TABLE school_schedule_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    academic_year VARCHAR(20) NOT NULL,
    term VARCHAR(50) NOT NULL,
    school_start_time TIME NOT NULL,
    school_end_time TIME NOT NULL,
    period_duration INTEGER NOT NULL, -- minutes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(school_id, academic_year, term)
);

-- Working days for the schedule
CREATE TABLE school_working_days (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    config_id UUID NOT NULL REFERENCES school_schedule_configs(id) ON DELETE CASCADE,
    day_of_week VARCHAR(10) NOT NULL CHECK (day_of_week IN ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')),
    UNIQUE(config_id, day_of_week)
);

-- Period definitions (including breaks)
CREATE TABLE school_periods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    config_id UUID NOT NULL REFERENCES school_schedule_configs(id) ON DELETE CASCADE,
    period_number DECIMAL(3,1) NOT NULL, -- e.g., 1, 2, 2.5 (for breaks)
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_break BOOLEAN DEFAULT false,
    break_name VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK (end_time > start_time)
);

-- ============================================
-- SUBJECT & ROOM TABLES
-- ============================================

CREATE TABLE subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    code VARCHAR(20) NOT NULL,
    name VARCHAR(100) NOT NULL,
    department VARCHAR(100),
    requires_lab BOOLEAN DEFAULT false,
    requires_special_room VARCHAR(50), -- e.g., 'computer_room', 'gym'
    color VARCHAR(100), -- Tailwind class for UI
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(school_id, code)
);

CREATE TABLE rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('classroom', 'lab', 'computer_room', 'auditorium', 'gym', 'library', 'other')),
    capacity INTEGER NOT NULL,
    building VARCHAR(100),
    floor INTEGER,
    facilities TEXT[], -- Array of facility names
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(school_id, name)
);

-- ============================================
-- SUBJECT REQUIREMENTS PER CLASS
-- ============================================

CREATE TABLE subject_requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    grade_id UUID NOT NULL REFERENCES grades(id) ON DELETE CASCADE,
    section_id UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    academic_year VARCHAR(20) NOT NULL,
    term VARCHAR(50) NOT NULL,
    periods_per_week INTEGER NOT NULL,
    assigned_teacher_id UUID REFERENCES users(id),
    requires_double_lesson BOOLEAN DEFAULT false,
    room_requirement VARCHAR(50), -- Room type if special room needed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(grade_id, section_id, subject_id, academic_year, term)
);

-- ============================================
-- TIMETABLE TABLES
-- ============================================

CREATE TABLE timetables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    grade_id UUID NOT NULL REFERENCES grades(id) ON DELETE CASCADE,
    section_id UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
    academic_year VARCHAR(20) NOT NULL,
    term VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    version INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP WITH TIME ZONE,
    published_by UUID REFERENCES users(id),
    UNIQUE(grade_id, section_id, academic_year, term, version)
);

CREATE TABLE timetable_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timetable_id UUID NOT NULL REFERENCES timetables(id) ON DELETE CASCADE,
    day_of_week VARCHAR(10) NOT NULL CHECK (day_of_week IN ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')),
    period_number INTEGER NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    subject_id UUID NOT NULL REFERENCES subjects(id),
    teacher_id UUID NOT NULL REFERENCES users(id),
    room_id UUID REFERENCES rooms(id),
    is_locked BOOLEAN DEFAULT false,
    is_double_lesson BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(timetable_id, day_of_week, period_number)
);

-- ============================================
-- AUDIT LOG TABLE
-- ============================================

CREATE TABLE timetable_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL CHECK (entity_type IN ('availability', 'timetable', 'slot')),
    entity_id UUID NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id),
    user_name VARCHAR(200) NOT NULL,
    user_role VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    changes JSONB, -- Store field changes
    reason TEXT,
    metadata JSONB -- Additional context
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_availability_slots_template ON teacher_availability_slots(template_id);
CREATE INDEX idx_availability_slots_day ON teacher_availability_slots(day_of_week);
CREATE INDEX idx_availability_exceptions_teacher ON teacher_availability_exceptions(teacher_id);
CREATE INDEX idx_availability_exceptions_date ON teacher_availability_exceptions(exception_date);
CREATE INDEX idx_timetable_slots_timetable ON timetable_slots(timetable_id);
CREATE INDEX idx_timetable_slots_teacher ON timetable_slots(teacher_id);
CREATE INDEX idx_timetable_slots_day ON timetable_slots(day_of_week);
CREATE INDEX idx_audit_logs_entity ON timetable_audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_timestamp ON timetable_audit_logs(timestamp);
```

---

## API Endpoints

### FastAPI Implementation

```python
# ============================================
# api/routes/timetable.py
# ============================================

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
from datetime import date, time

from app.core.deps import get_db, get_current_user
from app.models.user import User
from app.schemas import timetable as schemas
from app.services import timetable_service

router = APIRouter(prefix="/api/v1", tags=["Timetable"])

# ============================================
# TEACHER AVAILABILITY ENDPOINTS
# ============================================

@router.get("/teachers/{teacher_id}/availability", response_model=schemas.TeacherAvailabilityResponse)
async def get_teacher_availability(
    teacher_id: UUID,
    academic_year: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get a teacher's weekly availability template and exceptions.
    Teachers can view their own, admins can view any teacher's.
    """
    # Check permission
    if current_user.id != teacher_id and current_user.role not in ['school_administrator', 'manager']:
        raise HTTPException(status_code=403, detail="Not authorized")

    return await timetable_service.get_teacher_availability(db, teacher_id, academic_year)


@router.post("/teachers/{teacher_id}/availability", response_model=schemas.TeacherAvailabilityTemplate)
async def create_or_update_availability(
    teacher_id: UUID,
    availability: schemas.TeacherAvailabilityCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create or update a teacher's weekly availability template.
    Teachers can update their own, admins can update any teacher's (override).
    """
    is_override = current_user.id != teacher_id

    if is_override and current_user.role not in ['school_administrator', 'manager']:
        raise HTTPException(status_code=403, detail="Not authorized to override")

    return await timetable_service.save_teacher_availability(
        db,
        teacher_id,
        availability,
        updated_by=current_user,
        is_override=is_override
    )


@router.post("/teachers/{teacher_id}/availability/exceptions", response_model=schemas.AvailabilityException)
async def add_availability_exception(
    teacher_id: UUID,
    exception: schemas.AvailabilityExceptionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Add a date-specific availability exception."""
    if current_user.id != teacher_id and current_user.role not in ['school_administrator', 'manager']:
        raise HTTPException(status_code=403, detail="Not authorized")

    return await timetable_service.add_availability_exception(
        db, teacher_id, exception, created_by=current_user
    )


@router.delete("/teachers/{teacher_id}/availability/exceptions/{exception_id}")
async def delete_availability_exception(
    teacher_id: UUID,
    exception_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Remove an availability exception."""
    if current_user.id != teacher_id and current_user.role not in ['school_administrator', 'manager']:
        raise HTTPException(status_code=403, detail="Not authorized")

    await timetable_service.delete_availability_exception(db, exception_id)
    return {"message": "Exception deleted"}


@router.get("/availability/completion", response_model=List[schemas.AvailabilityCompletionStatus])
async def get_availability_completion_status(
    school_id: UUID,
    academic_year: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get completion status of all teachers' availability submissions.
    Admin only.
    """
    if current_user.role not in ['school_administrator', 'manager']:
        raise HTTPException(status_code=403, detail="Admin access required")

    return await timetable_service.get_availability_completion_status(db, school_id, academic_year)


# ============================================
# TIMETABLE GENERATION ENDPOINTS
# ============================================

@router.post("/timetables/generate", response_model=schemas.GenerateTimetableResponse)
async def generate_timetable(
    request: schemas.GenerateTimetableRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Auto-generate a timetable based on constraints.
    Returns draft timetable with any conflicts detected.
    """
    if current_user.role not in ['school_administrator', 'manager']:
        raise HTTPException(status_code=403, detail="Admin access required")

    return await timetable_service.generate_timetable(db, request, current_user)


@router.post("/timetables/validate", response_model=schemas.ValidationResult)
async def validate_timetable(
    request: schemas.ValidateTimetableRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Validate a timetable against all constraints.
    Returns list of conflicts and warnings.
    """
    if current_user.role not in ['school_administrator', 'manager']:
        raise HTTPException(status_code=403, detail="Admin access required")

    return await timetable_service.validate_timetable(db, request)


@router.post("/timetables/save-draft", response_model=schemas.Timetable)
async def save_timetable_draft(
    request: schemas.SaveDraftRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Save timetable as draft."""
    if current_user.role not in ['school_administrator', 'manager']:
        raise HTTPException(status_code=403, detail="Admin access required")

    return await timetable_service.save_timetable_draft(db, request, current_user)


@router.post("/timetables/{timetable_id}/publish", response_model=schemas.Timetable)
async def publish_timetable(
    timetable_id: UUID,
    request: schemas.PublishTimetableRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Publish a timetable. Must pass validation first.
    Optionally notify teachers and students.
    """
    if current_user.role not in ['school_administrator', 'manager']:
        raise HTTPException(status_code=403, detail="Admin access required")

    return await timetable_service.publish_timetable(
        db, timetable_id, request, current_user
    )


@router.get("/timetables", response_model=List[schemas.TimetableSummary])
async def list_timetables(
    school_id: UUID,
    grade_id: Optional[UUID] = None,
    section_id: Optional[UUID] = None,
    academic_year: Optional[str] = None,
    term: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List timetables with optional filters."""
    return await timetable_service.list_timetables(
        db, school_id, grade_id, section_id, academic_year, term, status
    )


@router.get("/timetables/{timetable_id}", response_model=schemas.TimetableDetail)
async def get_timetable(
    timetable_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get full timetable with all slots."""
    return await timetable_service.get_timetable(db, timetable_id)


@router.put("/timetables/{timetable_id}/slots/{slot_id}", response_model=schemas.TimetableSlot)
async def update_slot(
    timetable_id: UUID,
    slot_id: UUID,
    slot: schemas.TimetableSlotUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a single timetable slot."""
    if current_user.role not in ['school_administrator', 'manager']:
        raise HTTPException(status_code=403, detail="Admin access required")

    return await timetable_service.update_slot(db, timetable_id, slot_id, slot, current_user)


@router.delete("/timetables/{timetable_id}/slots/{slot_id}")
async def delete_slot(
    timetable_id: UUID,
    slot_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a timetable slot."""
    if current_user.role not in ['school_administrator', 'manager']:
        raise HTTPException(status_code=403, detail="Admin access required")

    await timetable_service.delete_slot(db, timetable_id, slot_id, current_user)
    return {"message": "Slot deleted"}


@router.post("/timetables/{timetable_id}/slots/{slot_id}/lock")
async def toggle_slot_lock(
    timetable_id: UUID,
    slot_id: UUID,
    lock: bool = True,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Lock or unlock a slot to prevent/allow auto-generation changes."""
    if current_user.role not in ['school_administrator', 'manager']:
        raise HTTPException(status_code=403, detail="Admin access required")

    return await timetable_service.toggle_slot_lock(db, slot_id, lock, current_user)


# ============================================
# TEACHER SCHEDULE VIEW ENDPOINTS
# ============================================

@router.get("/teachers/{teacher_id}/schedule", response_model=schemas.TeacherSchedule)
async def get_teacher_schedule(
    teacher_id: UUID,
    academic_year: Optional[str] = None,
    term: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get a teacher's complete schedule across all classes.
    Teachers can view their own, admins can view any teacher's.
    """
    if current_user.id != teacher_id and current_user.role not in ['school_administrator', 'manager']:
        raise HTTPException(status_code=403, detail="Not authorized")

    return await timetable_service.get_teacher_schedule(db, teacher_id, academic_year, term)


# ============================================
# DASHBOARD & STATS ENDPOINTS
# ============================================

@router.get("/timetables/dashboard/stats", response_model=schemas.TimetableDashboardStats)
async def get_dashboard_stats(
    school_id: UUID,
    academic_year: Optional[str] = None,
    term: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get timetable dashboard statistics."""
    if current_user.role not in ['school_administrator', 'manager']:
        raise HTTPException(status_code=403, detail="Admin access required")

    return await timetable_service.get_dashboard_stats(db, school_id, academic_year, term)


@router.get("/timetables/audit-logs", response_model=List[schemas.AuditLogEntry])
async def get_audit_logs(
    school_id: UUID,
    entity_type: Optional[str] = None,
    entity_id: Optional[UUID] = None,
    limit: int = Query(50, le=100),
    offset: int = 0,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get audit logs for timetable operations."""
    if current_user.role not in ['school_administrator', 'manager']:
        raise HTTPException(status_code=403, detail="Admin access required")

    return await timetable_service.get_audit_logs(
        db, school_id, entity_type, entity_id, limit, offset
    )
```

---

## Validation Rules

The system enforces the following validation rules:

### 1. No Teacher Double-Booking
```
ERROR: Teacher {name} is assigned to two classes at the same time
- Day: {day}
- Period: {period}
- Classes: {class1} & {class2}
```

### 2. Respect Teacher Unavailable Time
```
ERROR: {teacher_name} is unavailable during assigned slot
- Day: {day}
- Time: {start_time} - {end_time}
```

### 3. Meet Required Periods Per Subject
```
WARNING: {subject_name} has insufficient periods
- Required: {required} periods/week
- Scheduled: {actual} periods/week
- Deficit: {deficit} periods
```

### 4. Respect School Hours & Breaks
```
ERROR: Class scheduled during break time
- Break: {break_name}
- Time: {start_time} - {end_time}
```

### 5. Warn If Teacher Workload Exceeded
```
WARNING: {teacher_name} exceeds maximum periods per day
- Day: {day}
- Scheduled: {count} periods
- Maximum: {max} periods
```

### 6. Room Conflicts (Optional)
```
ERROR: Room {room_name} is double-booked
- Day: {day}
- Period: {period}
- Classes: {class1} & {class2}
```

---

## Conflict Messages

Human-readable conflict patterns for the UI:

```typescript
const CONFLICT_MESSAGES = {
  teacher_double_booking: {
    title: "Teacher Double-Booked",
    template: "{teacherName} is assigned to {count} classes at {day} Period {period}",
    severity: "error",
    suggestions: [
      "Move one class to a different period",
      "Assign a different teacher to one of the classes"
    ]
  },

  teacher_unavailable: {
    title: "Teacher Unavailable",
    template: "{teacherName} is marked as unavailable during {day} {startTime}-{endTime}",
    severity: "error",
    suggestions: [
      "Move the class to a time when the teacher is available",
      "Assign a different teacher for this class"
    ]
  },

  workload_exceeded: {
    title: "Workload Limit Exceeded",
    template: "{teacherName} has {current} periods on {day}, exceeding the maximum of {max}",
    severity: "warning",
    suggestions: [
      "Redistribute some periods to other days",
      "Consider assigning some classes to other teachers"
    ]
  },

  insufficient_slots: {
    title: "Insufficient Periods",
    template: "{subjectName} needs {required} periods/week but only {available} could be scheduled",
    severity: "warning",
    suggestions: [
      "Check teacher availability for more slots",
      "Adjust subject requirements if possible"
    ]
  },

  room_conflict: {
    title: "Room Conflict",
    template: "{roomName} is assigned to multiple classes at {day} Period {period}",
    severity: "error",
    suggestions: [
      "Assign a different room to one of the classes",
      "Move one class to a different time"
    ]
  },

  break_violation: {
    title: "Break Time Violation",
    template: "Class scheduled during {breakName} ({startTime}-{endTime})",
    severity: "error",
    suggestions: [
      "Move the class outside of break hours"
    ]
  }
};
```

---

## Pydantic Schemas (FastAPI)

```python
# schemas/timetable.py

from pydantic import BaseModel, validator
from typing import List, Optional, Dict, Any
from uuid import UUID
from datetime import date, time, datetime
from enum import Enum

class DayOfWeek(str, Enum):
    monday = "monday"
    tuesday = "tuesday"
    wednesday = "wednesday"
    thursday = "thursday"
    friday = "friday"
    saturday = "saturday"
    sunday = "sunday"

class AvailabilityStatus(str, Enum):
    available = "available"
    unavailable = "unavailable"
    preferred = "preferred"
    avoid = "avoid"

class TimetableStatus(str, Enum):
    draft = "draft"
    published = "published"
    archived = "archived"

class ConflictType(str, Enum):
    teacher_double_booking = "teacher_double_booking"
    teacher_unavailable = "teacher_unavailable"
    room_conflict = "room_conflict"
    workload_exceeded = "workload_exceeded"
    insufficient_slots = "insufficient_slots"
    break_violation = "break_violation"

# ---- Availability Schemas ----

class AvailabilitySlotBase(BaseModel):
    day_of_week: DayOfWeek
    start_time: time
    end_time: time
    status: AvailabilityStatus

class AvailabilitySlotCreate(AvailabilitySlotBase):
    pass

class AvailabilitySlot(AvailabilitySlotBase):
    id: UUID

    class Config:
        from_attributes = True

class TeacherPreferences(BaseModel):
    max_periods_per_day: Optional[int] = 6
    max_periods_per_week: Optional[int] = 28
    preferred_break_duration: Optional[int] = 15
    prefer_consecutive_classes: Optional[bool] = False
    avoid_first_period: Optional[bool] = False
    avoid_last_period: Optional[bool] = False
    notes: Optional[str] = None

class TeacherAvailabilityCreate(BaseModel):
    academic_year: str
    slots: List[AvailabilitySlotCreate]
    preferences: TeacherPreferences

class TeacherAvailabilityTemplate(BaseModel):
    id: UUID
    teacher_id: UUID
    academic_year: str
    slots: List[AvailabilitySlot]
    preferences: TeacherPreferences
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class AvailabilityExceptionCreate(BaseModel):
    exception_date: date
    start_time: time
    end_time: time
    status: AvailabilityStatus
    reason: Optional[str] = None

class AvailabilityException(BaseModel):
    id: UUID
    teacher_id: UUID
    exception_date: date
    start_time: time
    end_time: time
    status: AvailabilityStatus
    reason: Optional[str]
    created_by: UUID
    created_at: datetime

    class Config:
        from_attributes = True

class TeacherAvailabilityResponse(BaseModel):
    teacher_id: UUID
    teacher_name: str
    department: str
    template: Optional[TeacherAvailabilityTemplate]
    exceptions: List[AvailabilityException]
    completion_status: str

class AvailabilityCompletionStatus(BaseModel):
    teacher_id: UUID
    teacher_name: str
    department: str
    status: str  # 'complete', 'partial', 'pending'
    last_updated: Optional[datetime]

# ---- Timetable Schemas ----

class TimetableSlotBase(BaseModel):
    day_of_week: DayOfWeek
    period_number: int
    start_time: time
    end_time: time
    subject_id: UUID
    teacher_id: UUID
    room_id: Optional[UUID] = None
    is_locked: bool = False
    is_double_lesson: bool = False
    notes: Optional[str] = None

class TimetableSlotCreate(TimetableSlotBase):
    pass

class TimetableSlotUpdate(BaseModel):
    subject_id: Optional[UUID] = None
    teacher_id: Optional[UUID] = None
    room_id: Optional[UUID] = None
    is_locked: Optional[bool] = None
    notes: Optional[str] = None

class TimetableSlot(TimetableSlotBase):
    id: UUID
    timetable_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class TimetableBase(BaseModel):
    grade_id: UUID
    section_id: UUID
    academic_year: str
    term: str

class TimetableCreate(TimetableBase):
    slots: List[TimetableSlotCreate]

class Timetable(TimetableBase):
    id: UUID
    school_id: UUID
    status: TimetableStatus
    version: int
    slots: List[TimetableSlot]
    created_at: datetime
    updated_at: datetime
    published_at: Optional[datetime]
    published_by: Optional[UUID]

    class Config:
        from_attributes = True

class TimetableSummary(BaseModel):
    id: UUID
    grade_name: str
    section_name: str
    academic_year: str
    term: str
    status: TimetableStatus
    slot_count: int
    conflict_count: int
    updated_at: datetime

class TimetableDetail(Timetable):
    grade_name: str
    section_name: str
    conflicts: List["TimetableConflict"]
    warnings: List["TimetableConflict"]

# ---- Conflict Schemas ----

class ConflictDetails(BaseModel):
    day_of_week: Optional[DayOfWeek] = None
    period_number: Optional[int] = None
    teacher_id: Optional[UUID] = None
    teacher_name: Optional[str] = None
    subject_id: Optional[UUID] = None
    subject_name: Optional[str] = None
    room_id: Optional[UUID] = None
    room_name: Optional[str] = None
    grade_section: Optional[str] = None
    current_value: Optional[int] = None
    max_value: Optional[int] = None
    required_value: Optional[int] = None
    available_value: Optional[int] = None

class TimetableConflict(BaseModel):
    id: str
    type: ConflictType
    severity: str  # 'error' or 'warning'
    message: str
    details: ConflictDetails
    suggestions: Optional[List[str]] = None

class ValidationResult(BaseModel):
    is_valid: bool
    conflicts: List[TimetableConflict]
    warnings: List[TimetableConflict]
    summary: Dict[str, int]

# ---- Request/Response Schemas ----

class GenerateTimetableRequest(BaseModel):
    grade_id: UUID
    section_id: UUID
    academic_year: str
    term: str
    use_locked_slots: bool = True
    optimization_weights: Optional[Dict[str, float]] = None
    seed: Optional[int] = None

class GenerateTimetableResponse(BaseModel):
    success: bool
    timetable: Optional[Timetable]
    conflicts: List[TimetableConflict]
    execution_time_ms: int

class ValidateTimetableRequest(BaseModel):
    timetable_id: Optional[UUID] = None
    slots: Optional[List[TimetableSlotCreate]] = None
    grade_id: UUID
    section_id: UUID

class SaveDraftRequest(BaseModel):
    grade_id: UUID
    section_id: UUID
    academic_year: str
    term: str
    slots: List[TimetableSlotCreate]

class PublishTimetableRequest(BaseModel):
    notify_teachers: bool = True
    notify_students: bool = True

# ---- Dashboard Schemas ----

class TimetableDashboardStats(BaseModel):
    total_classes: int
    scheduled_classes: int
    unscheduled_classes: int
    total_conflicts: int
    total_warnings: int
    teachers_with_availability: int
    teachers_pending_availability: int
    published_timetables: int
    draft_timetables: int

class TeacherSchedule(BaseModel):
    teacher_id: UUID
    teacher_name: str
    slots: List[TimetableSlot]
    total_periods: int
    days_teaching: int

# ---- Audit Log Schemas ----

class AuditLogEntry(BaseModel):
    id: UUID
    action: str
    entity_type: str
    entity_id: UUID
    user_id: UUID
    user_name: str
    user_role: str
    timestamp: datetime
    changes: Optional[Dict[str, Any]]
    reason: Optional[str]
    metadata: Optional[Dict[str, Any]]

    class Config:
        from_attributes = True
```

---

*Last updated: January 2026*
