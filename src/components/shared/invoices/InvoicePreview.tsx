import React from 'react';
import { Invoice, InvoiceTemplateType } from './types';
import { InvoiceModern } from './templates/InvoiceModern';
import { InvoiceClassic } from './templates/InvoiceClassic';
import { InvoiceMinimal } from './templates/InvoiceMinimal';

interface InvoicePreviewProps {
    invoice: Invoice;
    template: InvoiceTemplateType;
}

export function InvoicePreview({ invoice, template }: InvoicePreviewProps) {
    // We override the invoice template with the selected one for preview purposes
    const previewInvoice = { ...invoice, template };

    switch (template) {
        case 'modern':
            return <InvoiceModern invoice={previewInvoice} />;
        case 'classic':
            return <InvoiceClassic invoice={previewInvoice} />;
        case 'minimal':
            return <InvoiceMinimal invoice={previewInvoice} />;
        default:
            return <InvoiceModern invoice={previewInvoice} />;
    }
}
