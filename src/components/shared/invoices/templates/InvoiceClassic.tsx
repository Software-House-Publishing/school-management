import React from 'react';
import { Invoice } from '../types';
import { format } from 'date-fns';

interface InvoiceTemplateProps {
    invoice: Invoice;
}

export function InvoiceClassic({ invoice }: InvoiceTemplateProps) {
    return (
        <div className="w-full h-full bg-white p-12 border border-gray-200 font-serif">
            {/* Header */}
            <div className="border-b-4 border-gray-800 pb-8 mb-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 uppercase tracking-widest">Invoice</h1>
                        <p className="mt-2 text-gray-600 text-lg">#{invoice.number}</p>
                    </div>
                    <div className="text-right">
                        <div className="font-bold text-xl text-gray-900">SchoolSystem</div>
                        <div className="text-gray-600">Admin Dept.</div>
                    </div>
                </div>
            </div>

            {/* Details Section */}
            <div className="grid grid-cols-2 gap-8 mb-10">
                <div>
                    <h3 className="text-gray-900 font-bold uppercase border-b border-gray-300 pb-1 mb-3 text-sm">Bill To:</h3>
                    <div className="text-gray-700">
                        <p className="font-semibold text-lg">{invoice.client.name}</p>
                        <p>{invoice.client.email}</p>
                        <p className="whitespace-pre-wrap mt-1">{invoice.client.address}</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-4">
                            <span className="font-bold text-gray-900">Date:</span>
                            <span className="text-gray-700">{format(new Date(invoice.date), 'MMMM dd, yyyy')}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <span className="font-bold text-gray-900">Due Date:</span>
                            <span className="text-gray-700">{format(new Date(invoice.dueDate), 'MMMM dd, yyyy')}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="mb-10">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-gray-900 border-y border-gray-300">
                            <th className="py-3 px-4 text-left font-bold border-r border-gray-300">Item Description</th>
                            <th className="py-3 px-4 text-center font-bold border-r border-gray-300 w-20">Qty</th>
                            <th className="py-3 px-4 text-right font-bold border-r border-gray-300 w-32">Unit Price</th>
                            <th className="py-3 px-4 text-right font-bold w-32">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.items.map((item, index) => (
                            <tr key={item.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} border-b border-gray-200`}>
                                <td className="py-3 px-4 border-r border-gray-200">{item.description}</td>
                                <td className="py-3 px-4 text-center border-r border-gray-200">{item.quantity}</td>
                                <td className="py-3 px-4 text-right border-r border-gray-200">${item.unitPrice.toFixed(2)}</td>
                                <td className="py-3 px-4 text-right font-medium">${item.total.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-12">
                <div className="w-1/3">
                    <div className="flex justify-between py-2 px-4 border-b border-gray-200">
                        <span className="font-semibold text-gray-700">Subtotal:</span>
                        <span className="text-gray-900">${invoice.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2 px-4 border-b border-gray-200">
                        <span className="font-semibold text-gray-700">Tax ({invoice.taxRate}%):</span>
                        <span className="text-gray-900">${invoice.taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-3 px-4 bg-gray-100 border-b-2 border-gray-800">
                        <span className="font-bold text-gray-900 text-lg">Total Due:</span>
                        <span className="font-bold text-gray-900 text-lg">${invoice.total.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-auto">
                <p className="text-gray-600 italic border-t border-gray-300 pt-4">{invoice.notes || "Thank you for your business."}</p>
            </div>
        </div>
    );
}
