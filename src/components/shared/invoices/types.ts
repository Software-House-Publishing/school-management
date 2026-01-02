export type InvoiceStatus = 'draft' | 'pending' | 'paid' | 'overdue' | 'cancelled';

export type InvoiceTemplateType = 'modern' | 'classic' | 'minimal';

export interface InvoiceItem {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

export interface InvoiceClient {
    name: string;
    email: string;
    address: string;
    phone?: string;
}

export interface Invoice {
    id: string;
    number: string;
    date: string;
    dueDate: string;
    status: InvoiceStatus;
    client: InvoiceClient;
    items: InvoiceItem[];
    subtotal: number;
    taxRate: number;
    taxAmount: number;
    total: number;
    notes?: string;
    template: InvoiceTemplateType;
    logoUrl?: string; // For company logo
}

// Helper to calculate totals
export const calculateInvoiceTotals = (items: InvoiceItem[], taxRate: number) => {
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const taxAmount = (subtotal * taxRate) / 100;
    const total = subtotal + taxAmount;
    return { subtotal, taxAmount, total };
};
