import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface UserFormProps {
    title: string;
    loading?: boolean;
    error?: string | null;
    onCancel: () => void;
    onSubmit: (e: React.FormEvent) => void;
    backButtonText?: string;
    saveButtonText?: string;
    children: React.ReactNode;
}

export function UserForm({
    title,
    loading = false,
    error = null,
    onCancel,
    onSubmit,
    backButtonText = 'Cancel',
    saveButtonText = 'Save',
    children,
}: UserFormProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                >
                    ← Back
                </Button>
                <h1 className="text-xl font-semibold">{title}</h1>
            </div>

            <Card padding="lg">
                <form className="space-y-8" onSubmit={onSubmit}>
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}

                    {children}

                    <div className="flex justify-end gap-2 pt-4 border-t border-gray-100 mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            disabled={loading}
                        >
                            {backButtonText}
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Saving...' : saveButtonText}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}

// Sub-component for form sections to keep styling consistent
interface UserFormSectionProps {
    title: string;
    children: React.ReactNode;
}

export function UserFormSection({ title, children }: UserFormSectionProps) {
    return (
        <section className="space-y-4">
            <h2 className="text-sm font-semibold text-gray-800 border-b pb-2">{title}</h2>
            {children}
        </section>
    );
}

// Sub-component for individual fields
interface UserFormFieldProps {
    label: string;
    required?: boolean;
    children: React.ReactNode;
    className?: string; // allow overriding width etc.
}

export function UserFormField({ label, required, children, className = '' }: UserFormFieldProps) {
    return (
        <div className={`space-y-1.5 text-sm ${className}`}>
            <label className="text-xs font-semibold text-slate-600 block">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            {children}
        </div>
    );
}
