import React, { ReactNode } from 'react';
import { Button } from '@/components/ui/Button';

interface UserDetailProps {
    title?: string;
    onBack: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    onDownloadReport?: () => void;
    children: ReactNode;
    actionButtons?: ReactNode; // For extra buttons
}

export function UserDetail({
    onBack,
    onEdit,
    onDelete,
    onDownloadReport,
    children,
    actionButtons
}: UserDetailProps) {
    return (
        <div className="space-y-6">
            {/* Top bar with Back button and Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onBack}
                    className="self-start"
                >
                    ← Back
                </Button>
                <div className="flex flex-wrap gap-2 self-start sm:self-auto">
                    {actionButtons}

                    {onEdit && (
                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={onEdit}
                        >
                            Edit
                        </Button>
                    )}

                    {onDelete && (
                        <Button
                            type="button"
                            variant="outline"
                            className="bg-white hover:bg-red-50 text-red-600 border-red-200 hover:border-red-300"
                            onClick={onDelete}
                        >
                            Delete
                        </Button>
                    )}

                    {onDownloadReport && (
                        <Button
                            type="button"
                            variant="outline"
                            className="bg-white hover:bg-purple-50 text-purple-600 border-purple-200 hover:border-purple-300"
                            onClick={onDownloadReport}
                        >
                            Report
                        </Button>
                    )}
                </div>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {children}
            </div>
        </div>
    );
}
