"use client";
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Quote {
  id: string;
  quoteNumber: string;
  customerName: string;
  totalAmount: number;
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
  validUntil: string;
  createdAt: string;
}

export default function QuotesPage() {
  const [quotes, setQuotes] = React.useState<Quote[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const response = await fetch('/api/v1/quotes');
        const data = await response.json();
        
        if (data.success) {
          setQuotes(data.data);
        } else {
          setError(data.error || 'Failed to load quotes');
        }
      } catch (err) {
        console.error('Error loading quotes:', err);
        setError('Failed to load quotes');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuotes();
  }, []);

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
    return <div className="p-4">Loading quotes...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Quotes</h1>
        <Button asChild>
          <Link href="/sales/quotes/new">
            <Plus className="h-4 w-4 mr-2" />
            Create Quote
          </Link>
        </Button>
      </div>

      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="border rounded-lg">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="py-3 px-4 text-left">Quote #</th>
                <th className="py-3 px-4 text-left">Customer</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Valid Until</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-left">Created At</th>
              </tr>
            </thead>
            <tbody>
              {quotes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-4 px-4 text-center text-muted-foreground">
                    No quotes found. Create your first quote!
                  </td>
                </tr>
              ) : (
                quotes.map((quote) => (
                  <tr key={quote.id} className="border-b">
                    <td className="py-3 px-4">
                      <Link
                        href={`/sales/quotes/${quote.id}`}
                        className="text-primary hover:underline"
                      >
                        {quote.quoteNumber}
                      </Link>
                    </td>
                    <td className="py-3 px-4">{quote.customerName}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(quote.status)}`}>
                        {quote.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {new Date(quote.validUntil).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      ₹{quote.totalAmount.toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </td>
                    <td className="py-3 px-4">
                      {new Date(quote.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
