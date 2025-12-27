import { useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import {
  Calendar,
  Clock,
  Users,
  MapPin,
} from 'lucide-react';
import {
  getWeeklySchedule,
  WeeklyScheduleSlot,
  formatTime,
  getCourseColor,
} from '../data/teacherPortalData';

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
  '14:00', '15:00', '16:00', '17:00'
];

export default function TeacherSchedule() {
  const schedule = useMemo(() => getWeeklySchedule(), []);

  // Group schedule by day
  const scheduleByDay = useMemo(() => {
    const grouped: Record<string, WeeklyScheduleSlot[]> = {};
    DAYS.forEach((day) => {
      grouped[day] = schedule
        .filter((slot) => slot.day === day)
        .sort((a, b) => a.startTime.localeCompare(b.startTime));
    });
    return grouped;
  }, [schedule]);

  // Calculate total hours
  const totalHours = useMemo(() => {
    let minutes = 0;
    schedule.forEach((slot) => {
      const [startH, startM] = slot.startTime.split(':').map(Number);
      const [endH, endM] = slot.endTime.split(':').map(Number);
      minutes += (endH * 60 + endM) - (startH * 60 + startM);
    });
    return Math.round(minutes / 60);
  }, [schedule]);

  // Get position and height for a slot
  const getSlotStyle = (slot: WeeklyScheduleSlot) => {
    const [startH, startM] = slot.startTime.split(':').map(Number);
    const [endH, endM] = slot.endTime.split(':').map(Number);

    const startMinutes = (startH - 8) * 60 + startM;
    const duration = (endH * 60 + endM) - (startH * 60 + startM);

    const top = (startMinutes / 60) * 80; // 80px per hour
    const height = (duration / 60) * 80;

    return { top: `${top}px`, height: `${height}px` };
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Weekly Schedule</h1>
        <p className="mt-2 text-sm text-gray-600">
          Your class schedule for the current semester
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-6">
        <Card className="p-4 rounded-xl border">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <Calendar className="h-4 w-4" />
            <span className="text-xs">Total Classes</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{schedule.length}</div>
        </Card>
        <Card className="p-4 rounded-xl border">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <Clock className="h-4 w-4" />
            <span className="text-xs">Weekly Hours</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">{totalHours}h</div>
        </Card>
        <Card className="p-4 rounded-xl border">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <Users className="h-4 w-4" />
            <span className="text-xs">Teaching Days</span>
          </div>
          <div className="text-2xl font-bold text-emerald-600">
            {Object.values(scheduleByDay).filter((slots) => slots.length > 0).length}
          </div>
        </Card>
        <Card className="p-4 rounded-xl border">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <MapPin className="h-4 w-4" />
            <span className="text-xs">Unique Rooms</span>
          </div>
          <div className="text-2xl font-bold text-purple-600">
            {new Set(schedule.map((s) => s.room)).size}
          </div>
        </Card>
      </div>

      {/* Calendar Grid */}
      <Card className="rounded-2xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-gray-900">Weekly Timetable</h3>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            {/* Header */}
            <div className="grid grid-cols-7 border-b">
              <div className="p-3 text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                Time
              </div>
              {DAYS.map((day) => (
                <div
                  key={day}
                  className="p-3 text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 text-center"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Time Grid */}
            <div className="grid grid-cols-7">
              {/* Time Column */}
              <div className="border-r">
                {TIME_SLOTS.map((time) => (
                  <div
                    key={time}
                    className="h-20 px-3 py-2 border-b text-xs text-gray-500"
                  >
                    {formatTime(time)}
                  </div>
                ))}
              </div>

              {/* Day Columns */}
              {DAYS.map((day) => (
                <div key={day} className="relative border-r">
                  {/* Empty time slots */}
                  {TIME_SLOTS.map((time) => (
                    <div key={time} className="h-20 border-b border-gray-100" />
                  ))}

                  {/* Scheduled slots */}
                  {scheduleByDay[day].map((slot) => {
                    const colors = getCourseColor(slot.color);
                    const style = getSlotStyle(slot);

                    return (
                      <div
                        key={slot.id}
                        className={cn(
                          'absolute left-1 right-1 rounded-lg p-2 overflow-hidden cursor-pointer hover:shadow-md transition-shadow',
                          colors.bg.replace('-500', '-100'),
                          colors.border
                        )}
                        style={style}
                      >
                        <div className={cn('text-sm font-semibold', colors.text)}>
                          {slot.courseCode}
                        </div>
                        <div className="text-xs text-gray-600 mt-0.5">
                          Section {slot.section}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {slot.room} • {slot.studentCount} students
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* List View */}
      <Card className="rounded-2xl border shadow-sm overflow-hidden mt-6">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-gray-900">Class List</h3>
        </div>

        <div className="divide-y">
          {DAYS.map((day) => {
            const daySlots = scheduleByDay[day];
            if (daySlots.length === 0) return null;

            return (
              <div key={day} className="p-4">
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  {day === 'Mon' ? 'Monday' :
                   day === 'Tue' ? 'Tuesday' :
                   day === 'Wed' ? 'Wednesday' :
                   day === 'Thu' ? 'Thursday' :
                   day === 'Fri' ? 'Friday' : 'Saturday'}
                </h4>
                <div className="space-y-2">
                  {daySlots.map((slot) => {
                    const colors = getCourseColor(slot.color);
                    return (
                      <div
                        key={slot.id}
                        className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className={cn('w-1 h-12 rounded-full', colors.bg)} />
                        <div className="w-24 text-sm">
                          <div className="font-medium text-gray-900">
                            {formatTime(slot.startTime)}
                          </div>
                          <div className="text-gray-500">
                            {formatTime(slot.endTime)}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">{slot.courseCode}</span>
                            <span className="text-sm text-gray-500">Section {slot.section}</span>
                          </div>
                          <div className="text-sm text-gray-600">{slot.courseName}</div>
                        </div>
                        <div className="text-right text-sm">
                          <div className="font-medium text-gray-900">{slot.room}</div>
                          <div className="text-gray-500">{slot.studentCount} students</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
