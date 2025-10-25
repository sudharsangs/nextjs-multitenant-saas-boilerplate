"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, Crown, Zap, Rocket, Building2, CreditCard, Calendar, Download } from "lucide-react";
import { api } from "@/lib/api-client";

type Subscription = {
  id: string;
  plan: string;
  status: string;
  startDate: string;
  endDate: string;
  duration: string;
  maxUsers: number;
  maxStorage: number;
  features: string[];
  isActive: boolean;
};

type Payment = {
  id: string;
  amount: string;
  currency: string;
  paymentDate: string;
  paymentMethod: string;
  status: string;
  transactionId: string | null;
};

const planFeatures: Record<string, { price: string; monthlyPrice: string; features: string[]; icon: any; color: string }> = {
  FREE: {
    price: "$0",
    monthlyPrice: "$0",
    icon: Building2,
    color: "text-gray-600",
    features: [
      "Up to 3 users",
      "1GB storage",
      "Basic features",
      "Email support",
      "Community access",
    ],
  },
  BASIC: {
    price: "$29",
    monthlyPrice: "$29",
    icon: Zap,
    color: "text-blue-600",
    features: [
      "Up to 10 users",
      "10GB storage",
      "All basic features",
      "Priority email support",
      "Advanced analytics",
      "API access",
    ],
  },
  PRO: {
    price: "$99",
    monthlyPrice: "$99",
    icon: Rocket,
    color: "text-purple-600",
    features: [
      "Up to 50 users",
      "100GB storage",
      "All basic features",
      "Priority support",
      "Advanced analytics",
      "Full API access",
      "Custom integrations",
      "Audit logs",
    ],
  },
  ENTERPRISE: {
    price: "Custom",
    monthlyPrice: "Custom",
    icon: Crown,
    color: "text-orange-600",
    features: [
      "Unlimited users",
      "1TB+ storage",
      "All features",
      "Dedicated support",
      "SLA guarantee",
      "Custom development",
      "On-premise option",
      "Advanced security",
    ],
  },
};

export default function BillingPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpgradeDialogOpen, setIsUpgradeDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("BASIC");
  const [selectedDuration, setSelectedDuration] = useState("monthly");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch subscription and payments
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch subscription
        const subResponse = await api.get<Subscription>("/subscriptions");
        if (subResponse.success && subResponse.data) {
          setSubscription(subResponse.data as unknown as Subscription);
        } else {
          setSubscription(null);
        }

        // Fetch payments
        const payResponse = await api.get("/payments");
        if (payResponse.success) {
          setPayments(payResponse.data || []);
        }
      } catch (err) {
        setError("Failed to fetch billing information");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle plan upgrade/downgrade
  const handlePlanChange = async () => {
    try {
      setSubmitting(true);
      setError(null);

      const response = await api.put("/subscriptions", {
        plan: selectedPlan,
        duration: selectedDuration,
        paymentMethod: "card",
        isAutoRenew: true,
      });

      if (response.success) {
        setSuccess(`Successfully changed to ${selectedPlan} plan`);
        setIsUpgradeDialogOpen(false);

        // Refresh subscription data
        const subResponse = await api.get<Subscription>("/subscriptions");
        if (subResponse.success && subResponse.data) {
          setSubscription(subResponse.data as unknown as Subscription);
        } else {
          setSubscription(null);
        }

        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(response.error || "Failed to update plan");
      }
    } catch (err) {
      setError("Failed to update plan");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status?: string) => {
    if (!status) return 'bg-gray-50 text-gray-600 ring-gray-500/10';
    switch (status.toUpperCase()) {
      case 'ACTIVE':
        return 'bg-green-50 text-green-700 ring-green-600/20';
      case 'TRIAL':
        return 'bg-blue-50 text-blue-700 ring-blue-600/20';
      case 'EXPIRED':
        return 'bg-red-50 text-red-700 ring-red-600/20';
      case 'CANCELLED':
        return 'bg-gray-50 text-gray-600 ring-gray-500/10';
      case 'COMPLETED':
        return 'bg-green-50 text-green-700 ring-green-600/20';
      case 'PENDING':
        return 'bg-yellow-50 text-yellow-700 ring-yellow-600/20';
      case 'FAILED':
        return 'bg-red-50 text-red-700 ring-red-600/20';
      default:
        return 'bg-gray-50 text-gray-600 ring-gray-500/10';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  const CurrentPlanIcon = subscription ? planFeatures[subscription.plan]?.icon : undefined;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Billing & Subscription</h1>
        <p className="text-muted-foreground mt-1">
          Manage your subscription and view payment history
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Current Subscription */}
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>Your active subscription details</CardDescription>
        </CardHeader>
        <CardContent>
          {subscription ? (
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg bg-primary/10`}>
                    {CurrentPlanIcon && (
                      <CurrentPlanIcon className={`h-6 w-6 ${planFeatures[subscription.plan].color}`} />
                    )}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{subscription.plan}</h3>
                    <p className="text-muted-foreground">
                      {planFeatures[subscription.plan]?.price}/month
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusColor(subscription.status)}`}>
                        {subscription.status}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        • Billed {subscription.duration}
                      </span>
                    </div>
                  </div>
                </div>
                <Button onClick={() => setIsUpgradeDialogOpen(true)}>
                  {subscription.plan === 'FREE' ? 'Upgrade Plan' : 'Change Plan'}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Start Date</p>
                    <p className="font-medium">{formatDate(subscription.startDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Renewal Date</p>
                    <p className="font-medium">{formatDate(subscription.endDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Auto Renew</p>
                    <p className="font-medium">{subscription.isActive ? 'Enabled' : 'Disabled'}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="font-medium mb-2">Plan Limits</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Max Users: </span>
                    <span className="font-medium">{subscription.maxUsers}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Storage: </span>
                    <span className="font-medium">{(subscription.maxStorage / 1000).toFixed(0)}GB</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No active subscription found
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>View all your past transactions</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No payment history yet
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{formatDate(payment.paymentDate)}</TableCell>
                    <TableCell className="font-medium">
                      {payment.currency} {parseFloat(payment.amount).toFixed(2)}
                    </TableCell>
                    <TableCell className="capitalize">{payment.paymentMethod}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {payment.transactionId || '-'}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusColor(payment.status)}`}>
                        {payment.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Invoice
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Upgrade/Change Plan Dialog */}
      <Dialog open={isUpgradeDialogOpen} onOpenChange={setIsUpgradeDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Choose Your Plan</DialogTitle>
            <DialogDescription>
              Select a plan that best fits your needs
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Duration Selector */}
            <div className="flex justify-center">
              <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly (5% off)</SelectItem>
                  <SelectItem value="half-yearly">Half-Yearly (10% off)</SelectItem>
                  <SelectItem value="annual">Annual (20% off)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Plan Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(planFeatures).map(([plan, details]) => {
                const Icon = details.icon;
                const isCurrentPlan = subscription?.plan === plan;

                return (
                  <Card
                    key={plan}
                    className={`cursor-pointer transition-all ${
                      selectedPlan === plan
                        ? 'ring-2 ring-primary shadow-lg'
                        : 'hover:shadow-md'
                    } ${isCurrentPlan ? 'border-primary' : ''}`}
                    onClick={() => setSelectedPlan(plan)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Icon className={`h-8 w-8 ${details.color}`} />
                        {isCurrentPlan && (
                          <span className="text-xs font-medium text-primary">Current</span>
                        )}
                      </div>
                      <CardTitle className="text-xl">{plan}</CardTitle>
                      <div className="text-3xl font-bold">{details.price}</div>
                      <CardDescription>per month</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {details.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsUpgradeDialogOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePlanChange}
              disabled={submitting || selectedPlan === subscription?.plan}
            >
              {submitting ? 'Processing...' : 'Confirm Change'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
