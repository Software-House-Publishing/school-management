import { ReactNode } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

/**
 * Props for the PageHeader component
 */
export interface PageHeaderProps {
  /** Main page title */
  title: string;
  /** Optional subtitle/description */
  subtitle?: string;
  /** Actions to display on the right side */
  actions?: ReactNode;
  /** Show back button */
  showBack?: boolean;
  /** Custom back URL (default: -1 in history) */
  backUrl?: string;
  /** Additional className for the container */
  className?: string;
}

/**
 * Consistent page header component used across all pages.
 * Provides title, subtitle, back navigation, and action buttons.
 *
 * @example
 * ```tsx
 * <PageHeader
 *   title="Students"
 *   subtitle="Manage student records"
 *   actions={<Button><Plus /> Add Student</Button>}
 * />
 * ```
 */
export function PageHeader({
  title,
  subtitle,
  actions,
  showBack = false,
  backUrl,
  className = '',
}: PageHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backUrl) {
      navigate(backUrl);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className={`flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between ${className}`}>
      <div className="flex items-start gap-3">
        {showBack && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="mt-1 -ml-2 p-2"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        )}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
          )}
        </div>
      </div>
      {actions && (
        <div className="flex items-center gap-3">
          {actions}
        </div>
      )}
    </div>
  );
}

export default PageHeader;
