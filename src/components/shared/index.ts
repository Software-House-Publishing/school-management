// Layout components
export { PageHeader } from './PageHeader';
export type { PageHeaderProps } from './PageHeader';

// Data display components
export { KpiCard, KpiCardsRow } from './data/KpiCard';
export type { KpiCardProps, KpiCardColor, KpiCardsRowProps, TrendDirection } from './data/KpiCard';

// Feedback components
export { EmptyState } from './feedback/EmptyState';
export type { EmptyStateProps } from './feedback/EmptyState';
export { LoadingState } from './feedback/LoadingState';
export type { LoadingStateProps } from './feedback/LoadingState';

// Dashboard components
export { IdentityCard } from './dashboard/IdentityCard';
export type { IdentityCardProps, IdentityField } from './dashboard/IdentityCard';
export { AnnouncementPanel } from './dashboard/AnnouncementPanel';
export type { AnnouncementPanelProps, AnnouncementItem, AnnouncementTab, AnnouncementPriority } from './dashboard/AnnouncementPanel';
export { ActionItemsCard } from './dashboard/ActionItemsCard';
export type { ActionItemsCardProps, ActionItem, ActionPriority } from './dashboard/ActionItemsCard';

// Existing shared components (re-exported for convenience)
// Note: These use named exports, import directly from their files for full type access
