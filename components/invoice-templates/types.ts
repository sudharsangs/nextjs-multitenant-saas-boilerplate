export interface InvoiceItem {
  id: string;
  productId: string;
  description: string;
  quantity: number;
  unit: string;
  price: number;
  tax: number;
  amount: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  address: string;
  gstin: string;
}

export interface InvoiceData {
  customer: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  paymentTerms: string;
  items: InvoiceItem[];
  notes: string;
  template: string;
  subtotal: number;
  taxTotal: number;
  total: number;
}

export interface InvoiceTemplateProps {
  formData: InvoiceData;
  selectedCustomer: Customer | null;
  paymentTermsOptions: Array<{
    value: string;
    label: string;
  }>;
}