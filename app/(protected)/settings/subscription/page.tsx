"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Crown, Calendar, Check } from "lucide-react";
import { api } from "@/lib/api-client";

type Subscription = {
  id: string;
  plan: 'FREE' | 'BASIC' | 'PRO' | 'ENTERPRISE';
  status: 'ACTIVE' | 'TRIAL' | 'EXPIRED' | 'CANCELLED' | 'PAYMENT_PENDING';
  startDate: string;
  endDate: string;
  duration: 'monthly' | 'quarterly' | 'half-yearly' | 'annual';
  maxUsers: number;
  maxStorage: number;
  features: string[];
  isActive: boolean;
};

const planDetails: Record<Subscription['plan'], { label: string; price: string; features: string[] }> = {
  FREE: { label: 'Free', price: '$0', features: ['Up to 3 users', '1GB storage', 'Email support'] },
  BASIC: { label: 'Basic', price: '$29', features: ['Up to 10 users', '10GB storage', 'Priority email', 'API access'] },
  PRO: { label: 'Pro', price: '$99', features: ['Up to 50 users', '100GB storage', 'Priority support', 'Audit logs', 'Custom integrations'] },
  ENTERPRISE: { label: 'Enterprise', price: 'Custom', features: ['Unlimited users', '1TB+ storage', 'SLA', 'Advanced security'] },
};

const durations: Subscription['duration'][] = ['monthly', 'quarterly', 'half-yearly', 'annual'];

export default function SubscriptionSettingsPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [plan, setPlan] = useState<Subscription['plan']>('BASIC');
  const [duration, setDuration] = useState<Subscription['duration']>('monthly');
  const [submitting, setSubmitting] = useState(false);

  const fetchSub = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<Subscription>("/subscriptions");
      if (res.success && res.data) {
        setSubscription(res.data as unknown as Subscription);
        setPlan((res.data as any).plan);
        setDuration((res.data as any).duration);
      } else if ((res as any).status === 404) {
        setSubscription(null);
      } else if (res.error) {
        setError(res.error);
      }
    } catch {
      // Some endpoints here return plain objects; we keep UI resilient
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSub(); }, []);

  const onSave = async () => {
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const payload = { plan, duration, paymentMethod: 'card', isAutoRenew: true };
      const res = subscription
        ? await api.put<Subscription>("/subscriptions", payload)
        : await api.post<Subscription>("/subscriptions", payload);
      if (res.success !== false) {
        setSuccess('Subscription updated');
        await fetchSub();
        setTimeout(() => setSuccess(null), 2000);
      } else {
        setError(res.error || 'Failed to update subscription');
      }
    } catch {
      setError('Unexpected error updating subscription');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (s: string) => new Date(s).toLocaleDateString();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Subscription</h1>
          <p className="text-muted-foreground">View and manage your plan.</p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>
      )}
      {success && (
        <Alert><AlertDescription>{success}</AlertDescription></Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Crown className="h-5 w-5" /> Current Plan</CardTitle>
          <CardDescription>Change plan and billing duration.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Plan</label>
                <Select value={plan} onValueChange={(v) => setPlan(v as Subscription['plan'])}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.keys(planDetails).map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Billing Cycle</label>
                <Select value={duration} onValueChange={(v) => setDuration(v as Subscription['duration'])}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {durations.map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={onSave} disabled={submitting}>{submitting ? 'Saving…' : (subscription ? 'Update Plan' : 'Create Subscription')}</Button>
            </div>

            <div className="space-y-3">
              {subscription ? (
                <>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Start</div>
                      <div className="font-medium">{formatDate(subscription.startDate)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Renews</div>
                      <div className="font-medium">{formatDate(subscription.endDate)}</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Included</div>
                    <ul className="text-sm space-y-1">
                      {planDetails[subscription.plan]?.features.map((f) => (
                        <li key={f} className="flex gap-2 items-center"><Check className="h-3 w-3 text-green-600" /> {f}</li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <div className="text-sm text-muted-foreground">No subscription yet. Choose a plan and create one.</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

