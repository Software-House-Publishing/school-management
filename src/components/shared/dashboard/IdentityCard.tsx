import { ReactNode } from 'react';
import { Card } from '@/components/ui/Card';
import { QrCode, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

/**
 * Props for extra info fields in identity card
 */
export interface IdentityField {
  label: string;
  value: string;
}

/**
 * Props for the IdentityCard component
 */
export interface IdentityCardProps {
  /** Type of identity card */
  type: 'student' | 'teacher';
  /** Person's full name */
  name: string;
  /** ID number */
  id: string;
  /** Current status */
  status: string;
  /** QR code identifier */
  qrId?: string;
  /** Additional fields to display */
  extraFields?: IdentityField[];
  /** Office hours (for teachers) */
  officeHours?: string;
  /** Office location (for teachers) */
  officeLocation?: string;
  /** Action button label */
  actionLabel?: string;
  /** Action button handler */
  onAction?: () => void;
  /** Additional className */
  className?: string;
}

/**
 * Unified identity card component for Student/Teacher virtual IDs.
 * Displays QR code, personal info, and role-specific details.
 *
 * @example
 * ```tsx
 * // Student ID
 * <IdentityCard
 *   type="student"
 *   name="John Doe"
 *   id="STU-2400001"
 *   status="Active"
 *   qrId="STU-2400001"
 *   actionLabel="Show for Attendance"
 * />
 *
 * // Teacher ID
 * <IdentityCard
 *   type="teacher"
 *   name="Dr. Jane Smith"
 *   id="TCH-1001"
 *   status="Active"
 *   extraFields={[
 *     { label: 'Department', value: 'Computer Science' },
 *     { label: 'Role', value: 'Professor' }
 *   ]}
 *   officeHours="Mon-Fri 2-4 PM"
 *   officeLocation="Room 305"
 * />
 * ```
 */
export function IdentityCard({
  type,
  name,
  id,
  status,
  qrId,
  extraFields = [],
  officeHours,
  officeLocation,
  actionLabel,
  onAction,
  className,
}: IdentityCardProps) {
  const isStudent = type === 'student';
  const cardTitle = isStudent ? 'Virtual ID Card' : 'Staff ID Card';
  const qrLabel = isStudent ? 'QR CODE' : 'STAFF QR CODE';
  const nameLabel = isStudent ? 'STUDENT NAME' : 'STAFF NAME';
  const qrGradient = isStudent
    ? 'from-teal-600 to-emerald-700'
    : 'from-blue-600 to-indigo-700';
  const iconBg = isStudent ? 'bg-amber-50 text-amber-700 ring-amber-100' : 'bg-blue-50 text-blue-700 ring-blue-100';

  return (
    <Card className={cn('h-full rounded-2xl border shadow-sm', className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b p-5">
        <h2 className="text-base font-semibold text-gray-900">{cardTitle}</h2>
        <div className={cn('inline-flex h-9 w-9 items-center justify-center rounded-xl ring-1', iconBg)}>
          <QrCode className="h-5 w-5" />
        </div>
      </div>

      <div className="p-5">
        {/* QR Code Section */}
        <div className="flex h-[128px] items-center justify-center rounded-2xl border border-dashed border-blue-200 bg-blue-50/40 p-4">
          <div className="flex items-center gap-4">
            <div className={cn(
              'flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-b shadow-md',
              qrGradient
            )}>
              <div className="grid grid-cols-5 gap-1">
                {Array.from({ length: 25 }).map((_, i) => (
                  <div
                    key={i}
                    className={cn('h-2 w-2 rounded-sm bg-white/70', i % 6 === 0 && 'bg-white')}
                  />
                ))}
              </div>
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-gray-500">{qrLabel}</div>
              <div className="mt-1 text-sm font-semibold text-gray-900">{qrId || id}</div>
              <div className="mt-1 text-xs text-gray-500">Scan for attendance</div>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-5 rounded-2xl border bg-white p-4">
          <div className="text-xs font-semibold tracking-wide text-gray-500">{nameLabel}</div>
          <div className="mt-1 text-lg font-semibold text-gray-900">{name}</div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs font-semibold tracking-wide text-gray-500">ID</div>
              <div className="mt-1 text-sm font-medium text-gray-900">{id}</div>
            </div>
            <div>
              <div className="text-xs font-semibold tracking-wide text-gray-500">STATUS</div>
              <div className="mt-1 text-sm font-semibold text-emerald-700 capitalize">
                {status.replace('_', ' ')}
              </div>
            </div>
          </div>

          {/* Extra fields for teachers */}
          {extraFields.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              {extraFields.map((field) => (
                <div key={field.label}>
                  <div className="text-xs font-semibold tracking-wide text-gray-500">
                    {field.label.toUpperCase()}
                  </div>
                  <div className="mt-1 text-sm font-medium text-gray-900">{field.value}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Office Hours (teachers only) */}
        {officeHours && (
          <div className="mt-4 rounded-xl bg-amber-50 border border-amber-100 p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-600" />
              <span className="text-xs font-semibold text-amber-800">OFFICE HOURS</span>
            </div>
            <div className="mt-2 text-sm font-medium text-amber-900">{officeHours}</div>
            {officeLocation && (
              <div className="mt-1 text-xs text-amber-700">{officeLocation}</div>
            )}
          </div>
        )}

        {/* Action Button */}
        {actionLabel && (
          <Button
            onClick={onAction}
            className="mt-5 w-full rounded-xl py-3"
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </Card>
  );
}

export default IdentityCard;
