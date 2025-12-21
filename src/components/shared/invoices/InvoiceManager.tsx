import React, { useState } from 'react';
import { DataTable, ColumnDef } from '../DataTable';
import { Invoice } from './types';
import { InvoiceForm } from './InvoiceForm';
import { InvoicePreview } from './InvoicePreview';
import { Plus, Eye, Edit, Trash, X, Printer, Download } from 'lucide-react';
import { format } from 'date-fns';

export function InvoiceManager() {
    const [view, setView] = useState<'list' | 'create' | 'edit' | 'preview'>('list');
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | undefined>(undefined);

    // Mock Data
    const [invoices, setInvoices] = useState<Invoice[]>([
        {
            id: '1',
            number: 'INV-1001',
            date: new Date().toISOString(),
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'paid',
            client: { name: 'Acme Corp', email: 'billing@acme.com', address: '123 Business Rd, Tech City' },
            items: [{ id: '1', description: 'Consulting', quantity: 10, unitPrice: 150, total: 1500 }],
            subtotal: 1500,
            taxRate: 10,
            taxAmount: 150,
            total: 1650,
            template: 'modern'
        },
        {
            id: '2',
            number: 'INV-1002',
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'pending',
            client: { name: 'Globex Inc', email: 'accounts@globex.com', address: '456 Global Ave, World Wide' },
            items: [{ id: '2', description: 'Software License', quantity: 1, unitPrice: 5000, total: 5000 }],
            subtotal: 5000,
            taxRate: 10,
            taxAmount: 500,
            total: 5500,
            template: 'classic'
        }
    ]);

    const handleSave = (invoice: Invoice) => {
        if (view === 'create') {
            setInvoices([invoice, ...invoices]);
        } else {
            setInvoices(invoices.map(inv => inv.id === invoice.id ? invoice : inv));
        }
        setView('list');
        setSelectedInvoice(undefined);
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this invoice?')) {
            setInvoices(invoices.filter(inv => inv.id !== id));
        }
    };

    const columns: ColumnDef<Invoice>[] = [
        { header: 'Number', accessorKey: 'number' },
        {
            header: 'Client',
            cell: (invoice: Invoice) => invoice.client.name
        },
        {
            header: 'Date',
            accessorKey: 'date',
            cell: (invoice: Invoice) => format(new Date(invoice.date), 'MMM dd, yyyy')
        },
        {
            header: 'Due Date',
            accessorKey: 'dueDate',
            cell: (invoice: Invoice) => format(new Date(invoice.dueDate), 'MMM dd, yyyy')
        },
        {
            header: 'Amount',
            accessorKey: 'total',
            cell: (invoice: Invoice) => `$${Number(invoice.total).toFixed(2)}`
        },
        {
            header: 'Status',
            accessorKey: 'status',
            cell: (invoice: Invoice) => {
                const colors: Record<string, string> = {
                    paid: 'bg-green-100 text-green-800',
                    pending: 'bg-yellow-100 text-yellow-800',
                    overdue: 'bg-red-100 text-red-800',
                    draft: 'bg-gray-100 text-gray-800',
                    cancelled: 'bg-gray-200 text-gray-600'
                };
                return (
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase ${colors[invoice.status] || 'bg-gray-100'}`}>
                        {invoice.status}
                    </span>
                );
            }
        },
        {
            header: 'Actions',
            cell: (invoice: Invoice) => {
                return (
                    <div className="flex gap-2">
                        <button
                            onClick={() => { setSelectedInvoice(invoice); setView('preview'); }}
                            className="p-1 hover:bg-gray-100 rounded text-gray-600 hover:text-indigo-600 transition-colors"
                            title="View / Print"
                        >
                            <Eye className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => { setSelectedInvoice(invoice); setView('edit'); }}
                            className="p-1 hover:bg-gray-100 rounded text-gray-600 hover:text-blue-600 transition-colors"
                            title="Edit"
                        >
                            <Edit className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => handleDelete(invoice.id)}
                            className="p-1 hover:bg-gray-100 rounded text-gray-600 hover:text-red-600 transition-colors"
                            title="Delete"
                        >
                            <Trash className="w-4 h-4" />
                        </button>
                    </div>
                );
            }
        }
    ];

    if (view === 'create' || view === 'edit') {
        return (
            <InvoiceForm
                initialData={selectedInvoice}
                onSubmit={handleSave}
                onCancel={() => { setView('list'); setSelectedInvoice(undefined); }}
            />
        );
    }

    if (view === 'preview' && selectedInvoice) {
        return (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-4xl h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                        <h3 className="text-lg font-bold text-gray-800">Invoice Preview: {selectedInvoice.number}</h3>
                        <div className="flex gap-2">
                            <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                                <Printer className="w-4 h-4" /> Print
                            </button>
                            <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                                <Download className="w-4 h-4" /> Download PDF
                            </button>
                            <button
                                onClick={() => { setView('list'); setSelectedInvoice(undefined); }}
                                className="p-2 hover:bg-gray-200 rounded-full"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-auto p-8 bg-gray-100">
                        <div className="max-w-3xl mx-auto shadow-lg min-h-[1000px]">
                            <InvoicePreview invoice={selectedInvoice} template={selectedInvoice.template} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
                    <p className="text-gray-500">Manage and track your invoices</p>
                </div>
                <button
                    onClick={() => { setSelectedInvoice(undefined); setView('create'); }}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 font-medium"
                >
                    <Plus className="w-5 h-5" />
                    Create Invoice
                </button>
            </div>

            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                <DataTable
                    data={invoices}
                    columns={columns}
                    searchPlaceholder="Search invoices..."
                />
            </div>
        </div>
    );
}
