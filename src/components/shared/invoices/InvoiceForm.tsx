import React, { useState, useEffect } from 'react';
import { Invoice, InvoiceItem, InvoiceTemplateType, calculateInvoiceTotals } from './types';
import { Plus, Trash2, Calendar, User, FileText, Layout } from 'lucide-react';

interface InvoiceFormProps {
    initialData?: Invoice;
    onSubmit: (invoice: Invoice) => void;
    onCancel: () => void;
}

export function InvoiceForm({ initialData, onSubmit, onCancel }: InvoiceFormProps) {
    // Default state initialization
    const [formData, setFormData] = useState<Invoice>(initialData || {
        id: crypto.randomUUID(),
        number: `INV-${Math.floor(Math.random() * 10000)}`,
        date: new Date().toISOString(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        status: 'draft',
        client: {
            name: '',
            email: '',
            address: '',
        },
        items: [{ id: crypto.randomUUID(), description: 'Consulting Service', quantity: 1, unitPrice: 100, total: 100 }],
        subtotal: 100,
        taxRate: 10,
        taxAmount: 10,
        total: 110,
        template: 'modern',
        notes: '',
    });

    // Recalculate totals whenever items or tax rate changes
    useEffect(() => {
        const { subtotal, taxAmount, total } = calculateInvoiceTotals(formData.items, formData.taxRate);
        setFormData(prev => ({ ...prev, subtotal, taxAmount, total }));
    }, [formData.items, formData.taxRate]);

    const handleClientChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            client: { ...prev.client, [name]: value }
        }));
    };

    const handleItemChange = (id: string, field: keyof InvoiceItem, value: string | number) => {
        setFormData(prev => {
            const newItems = prev.items.map(item => {
                if (item.id === id) {
                    const newItem = { ...item, [field]: value };
                    // Recalculate item total if quantity or price changes
                    if (field === 'quantity' || field === 'unitPrice') {
                        newItem.total = Number(newItem.quantity) * Number(newItem.unitPrice);
                    }
                    return newItem;
                }
                return item;
            });
            return { ...prev, items: newItems }; // Effect will handle overall totals
        });
    };

    const addItem = () => {
        setFormData(prev => ({
            ...prev,
            items: [
                ...prev.items,
                { id: crypto.randomUUID(), description: '', quantity: 1, unitPrice: 0, total: 0 }
            ]
        }));
    };

    const removeItem = (id: string) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.filter(item => item.id !== id)
        }));
    };

    return (
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden font-sans">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    {initialData ? 'Edit Invoice' : 'Create New Invoice'}
                </h2>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={() => onSubmit(formData)}
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg shadow-indigo-200"
                    >
                        Save Invoice
                    </button>
                </div>
            </div>

            <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Form Fields */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Invoice Details */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                            <FileText className="w-4 h-4" /> Invoice Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Number</label>
                                <input
                                    type="text"
                                    value={formData.number}
                                    onChange={e => setFormData({ ...formData, number: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    value={formData.status}
                                    onChange={e => setFormData({ ...formData, status: e.target.value as Invoice['status'] })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                                >
                                    <option value="draft">Draft</option>
                                    <option value="pending">Pending</option>
                                    <option value="paid">Paid</option>
                                    <option value="overdue">Overdue</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date Issued</label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={formData.date.split('T')[0]}
                                        onChange={e => setFormData({ ...formData, date: new Date(e.target.value).toISOString() })}
                                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={formData.dueDate.split('T')[0]}
                                        onChange={e => setFormData({ ...formData, dueDate: new Date(e.target.value).toISOString() })}
                                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Client Details */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                            <User className="w-4 h-4" /> Client Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.client.name}
                                    onChange={handleClientChange}
                                    placeholder="e.g. Acme Corp"
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.client.email}
                                    onChange={handleClientChange}
                                    placeholder="billing@acme.com"
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone (Optional)</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.client.phone || ''}
                                    onChange={handleClientChange}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <textarea
                                    name="address"
                                    value={formData.client.address}
                                    onChange={handleClientChange}
                                    rows={3}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Items */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Line Items</h3>
                            <button
                                type="button"
                                onClick={addItem}
                                className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1"
                            >
                                <Plus className="w-4 h-4" /> Add Item
                            </button>
                        </div>

                        <div className="space-y-4">
                            {formData.items.map((item) => (
                                <div key={item.id} className="flex gap-4 items-start p-4 bg-gray-50/50 rounded-xl border border-gray-100 group">
                                    <div className="flex-1 space-y-4 md:space-y-0 md:flex md:gap-4">
                                        <div className="flex-grow-[2]">
                                            <label className="block text-xs font-medium text-gray-500 mb-1 md:hidden">Description</label>
                                            <input
                                                type="text"
                                                value={item.description}
                                                onChange={e => handleItemChange(item.id, 'description', e.target.value)}
                                                placeholder="Item description"
                                                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                            />
                                        </div>
                                        <div className="w-full md:w-24">
                                            <label className="block text-xs font-medium text-gray-500 mb-1 md:hidden">Qty</label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={e => handleItemChange(item.id, 'quantity', parseFloat(e.target.value))}
                                                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                            />
                                        </div>
                                        <div className="w-full md:w-32">
                                            <label className="block text-xs font-medium text-gray-500 mb-1 md:hidden">Price</label>
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={item.unitPrice}
                                                onChange={e => handleItemChange(item.id, 'unitPrice', parseFloat(e.target.value))}
                                                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div className="pt-1 md:pt-2">
                                        <button
                                            type="button"
                                            onClick={() => removeItem(item.id)}
                                            className="text-gray-400 hover:text-red-500 transition-colors p-2"
                                            disabled={formData.items.length === 1}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-gray-100 pt-4 flex justify-end">
                            <div className="w-full md:w-1/2 space-y-2">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>{formData.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-600">Tax Rate (%)</span>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={formData.taxRate}
                                            onChange={e => setFormData({ ...formData, taxRate: parseFloat(e.target.value) })}
                                            className="w-16 px-2 py-1 rounded border border-gray-200 text-sm"
                                        />
                                    </div>
                                    <span>{formData.taxAmount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-lg font-bold text-gray-900 border-t border-gray-200 pt-2">
                                    <span>Total</span>
                                    <span>{formData.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Notes / Payment Instructions</h3>
                        <textarea
                            value={formData.notes}
                            onChange={e => setFormData({ ...formData, notes: e.target.value })}
                            rows={4}
                            placeholder="Enter any additional notes..."
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                        />
                    </div>
                </div>

                {/* Right Column: Template Selection (Sticky) */}
                <div className="lg:col-span-1">
                    <div className="sticky top-6 space-y-6">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2 mb-4">
                                <Layout className="w-4 h-4" /> Template Design
                            </h3>
                            <div className="space-y-3">
                                {['modern', 'classic', 'minimal'].map((template) => (
                                    <label key={template} className={`
                                flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all
                                ${formData.template === template
                                            ? 'border-indigo-500 bg-indigo-50/50 shadow-sm ring-1 ring-indigo-500'
                                            : 'border-gray-200 hover:bg-gray-50'
                                        }
                             `}>
                                        <input
                                            type="radio"
                                            name="template"
                                            value={template}
                                            checked={formData.template === template}
                                            onChange={() => setFormData({ ...formData, template: template as InvoiceTemplateType })}
                                            className="text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                                        />
                                        <span className="capitalize font-medium text-gray-700">{template}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
