import React from 'react';
import { Invoice } from '../types';
import { format } from 'date-fns';

interface InvoiceTemplateProps {
    invoice: Invoice;
}

export function InvoiceMinimal({ invoice }: InvoiceTemplateProps) {
    return (
        <div className="w-full h-full bg-white p-10 font-mono text-sm text-gray-800">

            {/* Header - Simple & Clean */}
            <div className="flex justify-between items-end mb-16">
                <div>
                    <h1 className="text-2xl font-bold mb-1">INVOICE {invoice.number}</h1>
                    <p className="text-gray-500">{format(new Date(invoice.date), 'dd MMM yyyy')}</p>
                </div>
                <div className="text-right">
                    <p className="font-bold">SchoolSystem</p>
                </div>
            </div>

            {/* Addresses */}
            <div className="mb-16">
                <p className="text-gray-400 mb-2">BILLED TO</p>
                <p className="font-bold text-lg">{invoice.client.name}</p>
                <p>{invoice.client.email}</p>
                <div className="mt-1">{invoice.client.address}</div>
            </div>

            {/* Content */}
            <div className="mb-16">
                <div className="grid grid-cols-12 gap-4 border-b border-black pb-2 mb-4 font-bold">
                    <div className="col-span-6">ITEM</div>
                    <div className="col-span-2 text-center">QTY</div>
                    <div className="col-span-2 text-right">RATE</div>
                    <div className="col-span-2 text-right">AMT</div>
                </div>

                <div className="space-y-4">
                    {invoice.items.map(item => (
                        <div key={item.id} className="grid grid-cols-12 gap-4">
                            <div className="col-span-6">{item.description}</div>
                            <div className="col-span-2 text-center text-gray-500">{item.quantity}</div>
                            <div className="col-span-2 text-right text-gray-500">{item.unitPrice.toFixed(2)}</div>
                            <div className="col-span-2 text-right font-medium">{item.total.toFixed(2)}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Totals */}
            <div className="flex justify-end border-t border-black pt-8">
                <div className="w-64 space-y-2">
                    <div className="flex justify-between">
                        <span className="text-gray-500">SUBTOTAL</span>
                        <span>{invoice.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">TAX {invoice.taxRate}%</span>
                        <span>{invoice.taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t border-dashed border-gray-300 pt-4 mt-2">
                        <span>TOTAL</span>
                        <span>${invoice.total.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <div className="mt-16 text-gray-400 text-xs">
                <p>PAYMENT DUE: {format(new Date(invoice.dueDate), 'dd MMM yyyy')}</p>
                {invoice.notes && <p className="mt-2 text-gray-500 max-w-lg">{invoice.notes}</p>}
            </div>

        </div>
    );
}
