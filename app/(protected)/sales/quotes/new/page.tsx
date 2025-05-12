"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

const paymentTermsOptions = [
  { value: "immediate", label: "Due on Receipt" },
  { value: "7days", label: "Net 7 Days" },
  { value: "15days", label: "Net 15 Days" },
  { value: "30days", label: "Net 30 Days" },
  { value: "45days", label: "Net 45 Days" },
  { value: "60days", label: "Net 60 Days" }
];

interface QuoteFormData {
  customerId: string;
  validUntil: string;
  paymentTerms: string;
  notes: string;
  termsAndConditions: string;
  items: {
    productId: string;
    quantity: string;
    unitPrice: string;
  }[];
}

export default function NewQuotePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [customers, setCustomers] = React.useState([]);
  const [products, setProducts] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [formData, setFormData] = React.useState<QuoteFormData>({
    customerId: '',
    validUntil: '',
    paymentTerms: 'immediate',
    notes: '',
    termsAndConditions: '',
    items: []
  });

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersRes, productsRes] = await Promise.all([
          fetch('/api/v1/customers'),
          fetch('/api/v1/products')
        ]);

        const [customersData, productsData] = await Promise.all([
          customersRes.json(),
          productsRes.json()
        ]);

        if (customersData.success) {
          setCustomers(customersData.data);
        }

        if (productsData.success) {
          setProducts(productsData.data);
        }
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load required data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { productId: '', quantity: '', unitPrice: '' }]
    }));
  };

  const updateItem = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };
      return { ...prev, items: newItems };
    });
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        items: formData.items.map(item => ({
          ...item,
          quantity: parseInt(item.quantity, 10),
          unitPrice: parseFloat(item.unitPrice)
        }))
      };

      const response = await fetch('/api/v1/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/sales/quotes');
      } else {
        setError(data.error || 'Failed to create quote');
      }
    } catch (error) {
      console.error('Error creating quote:', error);
      setError('Failed to create quote');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 container mx-auto p-6">
        <div className="flex items-center gap-2 mb-6">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Create New Quote</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Main quote information */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quote Details</CardTitle>
                  <CardDescription>
                    Basic information about the quote
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="customerId" className="text-sm font-medium">
                        Customer <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="customerId"
                        name="customerId"
                        value={formData.customerId}
                        onChange={handleChange}
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                        required
                      >
                        <option value="">Select a customer</option>
                        {customers.map((customer: any) => (
                          <option key={customer.id} value={customer.id}>
                            {customer.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="validUntil" className="text-sm font-medium">
                        Valid Until <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        id="validUntil"
                        name="validUntil"
                        value={formData.validUntil}
                        onChange={handleChange}
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="paymentTerms" className="text-sm font-medium">
                      Payment Terms
                    </label>
                    <select
                      id="paymentTerms"
                      name="paymentTerms"
                      value={formData.paymentTerms}
                      onChange={handleChange}
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                    >
                      {paymentTermsOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Line Items</CardTitle>
                  <CardDescription>
                    Add products to the quote
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-1 gap-4 md:grid-cols-4 items-end border-b pb-4">
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium">Product</label>
                        <select
                          value={item.productId}
                          onChange={(e) => updateItem(index, 'productId', e.target.value)}
                          className="w-full rounded-md border border-input bg-background px-3 py-2"
                        >
                          <option value="">Select a product</option>
                          {products.map((product: any) => (
                            <option key={product.id} value={product.id}>
                              {product.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Quantity</label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                          className="w-full rounded-md border border-input bg-background px-3 py-2"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Unit Price</label>
                        <div className="relative">
                          <span className="absolute left-3 top-2">₹</span>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.unitPrice}
                            onChange={(e) => updateItem(index, 'unitPrice', e.target.value)}
                            className="w-full rounded-md border border-input bg-background pl-7 pr-3 py-2"
                          />
                        </div>
                      </div>
                      <Button 
                        type="button"
                        variant="destructive"
                        onClick={() => removeItem(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addItem}
                  >
                    Add Item
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Right sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Additional Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="notes" className="text-sm font-medium">
                      Notes
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={4}
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      placeholder="Add any notes for the customer"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="termsAndConditions" className="text-sm font-medium">
                      Terms and Conditions
                    </label>
                    <textarea
                      id="termsAndConditions"
                      name="termsAndConditions"
                      value={formData.termsAndConditions}
                      onChange={handleChange}
                      rows={4}
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      placeholder="Add terms and conditions"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t p-4">
                  <Button
                    variant="outline"
                    onClick={() => router.push('/sales/quotes')}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex gap-1"
                  >
                    <Save className="h-4 w-4" />
                    {isSubmitting ? "Saving..." : "Save Quote"}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
