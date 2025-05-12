"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Send, Ban, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface QuoteItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product: {
    id: string;
    name: string;
    code: string;
  };
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  gstin?: string;
}

interface Quote {
  id: string;
  quoteNumber: string;
  customer: Customer;
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
  validUntil: string;
  totalAmount: number;
  taxAmount: number;
  notes?: string;
  termsAndConditions?: string;
  createdAt: string;
  items: QuoteItem[];
}

export default function QuotePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [quote, setQuote] = React.useState<Quote | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await fetch(`/api/v1/quotes/${params.id}`);
        const data = await response.json();
        
        if (data.success) {
          setQuote(data.data);
        } else {
          setError(data.error || 'Failed to load quote');
        }
      } catch (err) {
        console.error('Error loading quote:', err);
        setError('Failed to load quote');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuote();
  }, [params.id]);

  const updateQuoteStatus = async (status: 'SENT' | 'ACCEPTED' | 'REJECTED') => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/v1/quotes/${params.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (data.success) {
        setQuote(prev => prev ? { ...prev, status } : null);
      } else {
        setError(data.error || 'Failed to update quote status');
      }
    } catch (err) {
      console.error('Error updating quote status:', err);
      setError('Failed to update quote status');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: Quote['status']) => {
    switch (status) {
      case 'DRAFT':
        return 'bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
      case 'SENT':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case 'ACCEPTED':
        return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'REJECTED':
        return 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      case 'EXPIRED':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400';
      default:
        return 'bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading quote...</div>;
  }

  if (error || !quote) {
    return <div className="p-4 text-red-500">{error || 'Quote not found'}</div>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Quote #{quote.quoteNumber}</h1>
              <p className="text-muted-foreground">Created on {new Date(quote.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {quote.status === 'DRAFT' && (
              <Button
                onClick={() => updateQuoteStatus('SENT')}
                disabled={isSubmitting}
              >
                <Send className="h-4 w-4 mr-2" />
                Send Quote
              </Button>
            )}
            {quote.status === 'SENT' && (
              <>
                <Button
                  variant="destructive"
                  onClick={() => updateQuoteStatus('REJECTED')}
                  disabled={isSubmitting}
                >
                  <Ban className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  onClick={() => updateQuoteStatus('ACCEPTED')}
                  disabled={isSubmitting}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Accept
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quote Details</CardTitle>
                <CardDescription>
                  Status: <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(quote.status)}`}>
                    {quote.status}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Customer</h3>
                      <p className="mt-1">{quote.customer.name}</p>
                      <p className="text-sm text-muted-foreground">{quote.customer.email}</p>
                      <p className="text-sm text-muted-foreground">{quote.customer.phone}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Valid Until</h3>
                      <p className="mt-1">{new Date(quote.validUntil).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Items</h3>
                    <div className="border rounded-lg">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="py-2 px-4 text-left">Product</th>
                            <th className="py-2 px-4 text-center">Quantity</th>
                            <th className="py-2 px-4 text-right">Unit Price</th>
                            <th className="py-2 px-4 text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {quote.items.map((item) => (
                            <tr key={item.id} className="border-b">
                              <td className="py-2 px-4">
                                <div>{item.product.name}</div>
                                <div className="text-sm text-muted-foreground">{item.product.code}</div>
                              </td>
                              <td className="py-2 px-4 text-center">{item.quantity}</td>
                              <td className="py-2 px-4 text-right">
                                ₹{item.unitPrice.toLocaleString('en-IN', {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2
                                })}
                              </td>
                              <td className="py-2 px-4 text-right">
                                ₹{item.totalPrice.toLocaleString('en-IN', {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2
                                })}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between py-2 text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{(quote.totalAmount - quote.taxAmount).toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}</span>
                  </div>
                  <div className="flex justify-between py-2 text-sm border-b">
                    <span className="text-muted-foreground">Tax</span>
                    <span>₹{quote.taxAmount.toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}</span>
                  </div>
                  <div className="flex justify-between py-2 font-medium">
                    <span>Total</span>
                    <span>₹{quote.totalAmount.toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {(quote.notes || quote.termsAndConditions) && (
              <Card>
                <CardHeader>
                  <CardTitle>Additional Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {quote.notes && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Notes</h3>
                      <p className="text-sm">{quote.notes}</p>
                    </div>
                  )}
                  {quote.termsAndConditions && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Terms and Conditions</h3>
                      <p className="text-sm">{quote.termsAndConditions}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
