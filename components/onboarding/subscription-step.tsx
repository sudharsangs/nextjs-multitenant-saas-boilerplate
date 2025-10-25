import { SubscriptionData } from "./types";

interface Props {
  subscriptionData: SubscriptionData;
  setSubscriptionData: React.Dispatch<React.SetStateAction<SubscriptionData>>;
  error: string;
}

export const SubscriptionStep = ({
  subscriptionData,
  setSubscriptionData,
  error,
}: Props) => {
  const getDurationMultiplier = (duration: string) => {
    switch (duration) {
      case 'annual': return 10; // 2 months free
      case 'half-yearly': return 5.5; // 0.5 month free
      case 'quarterly': return 2.85; // 5% discount
      case 'monthly':
      default:
        return 1;
    }
  };

  const getPrice = (basePrice: number) => {
    const multiplier = getDurationMultiplier(subscriptionData.duration);
    return Math.round(basePrice * multiplier);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Choose Your Plan</h3>
      
      <div className="flex justify-center space-x-4 mb-6">
        <button
          type="button"
          className={`px-4 py-2 rounded-md ${
            subscriptionData.duration === 'annual' 
              ? 'bg-primary text-white' 
              : 'bg-secondary text-foreground'
          }`}
          onClick={() => setSubscriptionData({ ...subscriptionData, duration: 'annual' })}
        >
          Annual
          <span className="block text-xs">Save 16%</span>
        </button>
        <button
          type="button"
          className={`px-4 py-2 rounded-md ${
            subscriptionData.duration === 'half-yearly' 
              ? 'bg-primary text-white' 
              : 'bg-secondary text-foreground'
          }`}
          onClick={() => setSubscriptionData({ ...subscriptionData, duration: 'half-yearly' })}
        >
          Half Yearly
          <span className="block text-xs">Save 8%</span>
        </button>
        <button
          type="button"
          className={`px-4 py-2 rounded-md ${
            subscriptionData.duration === 'quarterly' 
              ? 'bg-primary text-white' 
              : 'bg-secondary text-foreground'
          }`}
          onClick={() => setSubscriptionData({ ...subscriptionData, duration: 'quarterly' })}
        >
          Quarterly
          <span className="block text-xs">Save 5%</span>
        </button>
        <button
          type="button"
          className={`px-4 py-2 rounded-md ${
            subscriptionData.duration === 'monthly' 
              ? 'bg-primary text-white' 
              : 'bg-secondary text-foreground'
          }`}
          onClick={() => setSubscriptionData({ ...subscriptionData, duration: 'monthly' })}
        >
          Monthly
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div 
          className={`border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors ${
            subscriptionData.plan === 'FREE' ? 'border-primary bg-primary/5' : ''
          }`}
          onClick={() => setSubscriptionData({ ...subscriptionData, plan: 'FREE' })}
        >
          <h4 className="text-lg font-medium">Free</h4>
          <p className="text-2xl font-bold mt-2">₹0
            <span className="text-sm font-normal">/{subscriptionData.duration.replace('-', ' ')}</span>
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>• Basic app features</li>
            <li>• Up to 100 products</li>
            <li>• 1 user</li>
            <li>• Community support</li>
          </ul>
        </div>
        
        <div 
          className={`border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors ${
            subscriptionData.plan === 'BASIC' ? 'border-primary bg-primary/5' : ''
          }`}
          onClick={() => setSubscriptionData({ ...subscriptionData, plan: 'BASIC' })}
        >
          <h4 className="text-lg font-medium">Basic</h4>
          <p className="text-2xl font-bold mt-2">₹{getPrice(999)}
            <span className="text-sm font-normal">/{subscriptionData.duration.replace('-', ' ')}</span>
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>• Full app features</li>
            <li>• Up to 1,000 products</li>
            <li>• 3 users</li>
            <li>• Email support</li>
            <li>• Basic reporting</li>
          </ul>
        </div>
        
        <div 
          className={`border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors ${
            subscriptionData.plan === 'PRO' ? 'border-primary bg-primary/5' : ''
          }`}
          onClick={() => setSubscriptionData({ ...subscriptionData, plan: 'PRO' })}
        >
          <h4 className="text-lg font-medium">Pro</h4>
          <p className="text-2xl font-bold mt-2">₹{getPrice(2499)}
            <span className="text-sm font-normal">/{subscriptionData.duration.replace('-', ' ')}</span>
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>• Advanced app features</li>
            <li>• Unlimited products</li>
            <li>• Up to 10 users</li>
            <li>• Priority support</li>
            <li>• Advanced analytics</li>
            <li>• API access</li>
          </ul>
        </div>
      </div>
      
      <div className="mt-6">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            checked={subscriptionData.isAutoRenew}
            onChange={(e) => setSubscriptionData({ ...subscriptionData, isAutoRenew: e.target.checked })}
          />
          <span className="ml-2 text-sm">Enable auto-renewal</span>
        </label>
      </div>
      
      <div>
        <label htmlFor="paymentMethod" className="block text-sm font-medium text-foreground mb-1">
          Payment Method
        </label>
        <select
          id="paymentMethod"
          name="paymentMethod"
          value={subscriptionData.paymentMethod}
          onChange={(e) => setSubscriptionData({ ...subscriptionData, paymentMethod: e.target.value })}
          className="appearance-none relative block w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        >
          <option value="credit">Credit Card</option>
          <option value="debit">Debit Card</option>
          <option value="upi">UPI</option>
          <option value="netbanking">Net Banking</option>
        </select>
      </div>
      
      {subscriptionData.plan !== 'FREE' && (
        <div className="text-sm text-muted-foreground">
          <p>You&apos;ll be charged after the 14-day free trial. Cancel anytime.</p>
        </div>
      )}
      
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive text-destructive text-sm rounded-md">
          {error}
        </div>
      )}
    </div>
  );
};
