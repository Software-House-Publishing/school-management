import React from 'react';
import { Invoice } from '../types';
import { format } from 'date-fns';

interface InvoiceTemplateProps {
    invoice: Invoice;
}

export function InvoiceModern({ invoice }: InvoiceTemplateProps) {
    return (
        <div className="w-full h-full bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col font-sans">
            {/* Header */}
            <div className="flex justify-between items-start mb-12">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200">
                            {invoice.logoUrl ? <img src={invoice.logoUrl} alt="Logo" className="w-full h-full object-cover rounded-xl" /> : 'S'}
                        </div>
                        <span className="text-2xl font-bold text-gray-900 tracking-tight">SchoolSystem</span>
                    </div>
                    <p className="text-gray-500 text-sm ml-1">Excellence in Education</p>
                </div>
                <div className="text-right">
                    <h1 className="text-5xl font-extrabold text-gray-900/10 tracking-widest uppercase mb-2">Invoice</h1>
                    <p className="text-indigo-600 font-semibold text-lg">{invoice.number}</p>
                </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-12 mb-12">
                <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Billed To</h3>
                    <p className="text-lg font-semibold text-gray-900 mb-1">{invoice.client.name}</p>
                    <p className="text-gray-600 mb-1">{invoice.client.email}</p>
                    <p className="text-gray-600 whitespace-pre-wrap">{invoice.client.address}</p>
                </div>
                <div className="flex flex-col justify-between">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                        <span className="text-gray-500">Date Issued</span>
                        <span className="font-semibold text-gray-900">{format(new Date(invoice.date), 'MMM dd, yyyy')}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                        <span className="text-gray-500">Due Date</span>
                        <span className="font-semibold text-gray-900">{format(new Date(invoice.dueDate), 'MMM dd, yyyy')}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                        <span className="text-gray-500">Amount Due</span>
                        <span className="font-bold text-2xl text-indigo-600">${invoice.total.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Items Table */}
            <div className="flex-1">
                <table className="w-full mb-8">
                    <thead>
                        <tr className="text-left border-b-2 border-gray-100">
                            <th className="py-4 font-semibold text-gray-900 w-1/2 pl-2">Description</th>
                            <th className="py-4 font-semibold text-gray-900 text-center">Qty</th>
                            <th className="py-4 font-semibold text-gray-900 text-right">Price</th>
                            <th className="py-4 font-semibold text-gray-900 text-right pr-2">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {invoice.items.map((item) => (
                            <tr key={item.id} className="text-sm text-gray-600 hover:bg-gray-50/30 transition-colors">
                                <td className="py-4 pl-2 font-medium">{item.description}</td>
                                <td className="py-4 text-center">{item.quantity}</td>
                                <td className="py-4 text-right">${item.unitPrice.toFixed(2)}</td>
                                <td className="py-4 text-right pr-2 font-semibold text-gray-900">${item.total.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Summary */}
            <div className="flex justify-end mb-12">
                <div className="w-1/2 space-y-3">
                    <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span className="font-medium">${invoice.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>Tax ({invoice.taxRate}%)</span>
                        <span className="font-medium">${invoice.taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t-2 border-gray-100">
                        <span className="font-bold text-gray-900 text-lg">Total</span>
                        <span className="font-extrabold text-3xl text-indigo-600">${invoice.total.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-auto pt-6 border-t border-gray-100 flex justify-between items-end">
                <div className="text-sm text-gray-500 max-w-md">
                    <p className="font-semibold text-gray-900 mb-1">Notes:</p>
                    <p>{invoice.notes || "Thank you for your business. Please make payment by the due date."}</p>
                </div>
                <div className="text-right text-xs text-gray-400">
                    Generated via SchoolSystem
                </div>
            </div>
        </div>
    );
}
