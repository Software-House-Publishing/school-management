import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Calendar, Bell, Plus, Trash2, Edit2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export interface Announcement {
    id: string;
    title: string;
    content: string;
    date: string;
    author: string;
    priority?: 'normal' | 'high' | 'urgent';
    read?: boolean;
}

interface AnnouncementFeedProps {
    title?: string;
    subtitle?: string;
    announcements: Announcement[];
    isAdmin?: boolean;
    onAdd?: () => void;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
    loading?: boolean;
}

export function AnnouncementFeed({
    title = "Announcements",
    subtitle = "Stay updated with the latest news",
    announcements,
    isAdmin = false,
    onAdd,
    onEdit,
    onDelete,
    loading = false,
}: AnnouncementFeedProps) {

    const getPriorityColor = (priority: string = 'normal') => {
        switch (priority) {
            case 'urgent': return 'bg-red-100 text-red-700 border-red-200';
            case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
            default: return 'bg-blue-50 text-blue-700 border-blue-200';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                    <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
                </div>
                {isAdmin && onAdd && (
                    <Button onClick={onAdd} className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:shadow-blue-600/30 hover:-translate-y-0.5">
                        <Plus className="w-4 h-4 mr-2" />
                        New Announcement
                    </Button>
                )}
            </div>

            <div className="grid gap-4">
                {loading ? (
                    // Skeletons
                    [1, 2, 3].map((i) => (
                        <Card key={i} variant="glass" className="opacity-70">
                            <div className="animate-pulse space-y-3">
                                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                <div className="space-y-2 pt-2">
                                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                </div>
                            </div>
                        </Card>
                    ))
                ) : announcements.length === 0 ? (
                    <Card variant="glass" className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                            <Bell className="w-8 h-8 text-gray-300" />
                        </div>
                        <p className="text-gray-900 font-medium">No announcements yet</p>
                        <p className="text-sm text-gray-500 mt-1">Check back later for updates</p>
                    </Card>
                ) : (
                    <AnimatePresence>
                        {announcements.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card variant="glass" className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-blue-200/50">
                                    {/* Decorative accent */}
                                    <div className={`absolute top-0 left-0 w-1 h-full ${item.priority === 'urgent' ? 'bg-red-500' : item.priority === 'high' ? 'bg-orange-500' : 'bg-blue-500'} opacity-0 group-hover:opacity-100 transition-opacity`} />

                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center gap-3">
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(item.priority)}`}>
                                                    {item.priority ? item.priority.charAt(0).toUpperCase() + item.priority.slice(1) : 'Normal'}
                                                </span>
                                                <span className="flex items-center text-xs text-gray-400">
                                                    <Calendar className="w-3 h-3 mr-1" />
                                                    {item.date}
                                                </span>
                                            </div>

                                            <h3 className="font-semibold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                                                {item.title}
                                            </h3>

                                            <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                                                {item.content}
                                            </div>

                                            <div className="pt-2 flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-600 border border-gray-200">
                                                    {item.author.charAt(0)}
                                                </div>
                                                <span className="text-xs text-gray-500">Posted by {item.author}</span>
                                            </div>
                                        </div>

                                        {isAdmin && (
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {onEdit && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => onEdit(item.id)}
                                                        className="w-8 h-8 p-0 text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </Button>
                                                )}
                                                {onDelete && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => onDelete(item.id)}
                                                        className="w-8 h-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}
