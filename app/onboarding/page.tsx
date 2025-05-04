"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Define types for the company and subscription data
interface CompanyData {
  name: string;
  gstin?: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  website?: string;
  billingAddress?: string;
  logo?: string;
  theme: string;
  settings: Record<string, object>;
}

interface SubscriptionData {
  plan: 'FREE' | 'BASIC' | 'PRO';
  paymentMethod: string;
  isAutoRenew: boolean;
}

interface StepProps {
  companyData: CompanyData;
  setCompanyData: React.Dispatch<React.SetStateAction<CompanyData>>;
  error: string;
}

interface SubscriptionStepProps {
  subscriptionData: SubscriptionData;
  setSubscriptionData: React.Dispatch<React.SetStateAction<SubscriptionData>>;
  error: string;
}

// Step components for the onboarding process
const CompanyInfoStep = ({
  companyData,
  setCompanyData,
  error,
}: StepProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Company Information</h3>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
          Company Name *
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={companyData.name}
          onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
          className="appearance-none relative block w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          placeholder="Enter company name"
        />
      </div>
      <div>
        <label htmlFor="gstin" className="block text-sm font-medium text-foreground mb-1">
          GSTIN
        </label>
        <input
          id="gstin"
          name="gstin"
          type="text"
          value={companyData.gstin || ""}
          onChange={(e) => setCompanyData({ ...companyData, gstin: e.target.value })}
          className="appearance-none relative block w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          placeholder="Enter GSTIN (optional)"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
          Business Email *
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={companyData.email}
          onChange={(e) => setCompanyData({ ...companyData, email: e.target.value })}
          className="appearance-none relative block w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          placeholder="Enter business email"
        />
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1">
          Phone Number *
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          value={companyData.phone}
          onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
          className="appearance-none relative block w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          placeholder="Enter phone number"
        />
      </div>
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive text-destructive text-sm rounded-md">
          {error}
        </div>
      )}
    </div>
  );
};

const AddressStep = ({
  companyData,
  setCompanyData,
  error,
}: StepProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Company Address</h3>
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-foreground mb-1">
          Street Address *
        </label>
        <input
          id="address"
          name="address"
          type="text"
          required
          value={companyData.address}
          onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })}
          className="appearance-none relative block w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          placeholder="Street address"
        />
      </div>
      <div>
        <label htmlFor="city" className="block text-sm font-medium text-foreground mb-1">
          City *
        </label>
        <input
          id="city"
          name="city"
          type="text"
          required
          value={companyData.city}
          onChange={(e) => setCompanyData({ ...companyData, city: e.target.value })}
          className="appearance-none relative block w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          placeholder="City"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-foreground mb-1">
            State *
          </label>
          <input
            id="state"
            name="state"
            type="text"
            required
            value={companyData.state}
            onChange={(e) => setCompanyData({ ...companyData, state: e.target.value })}
            className="appearance-none relative block w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="State"
          />
        </div>
        <div>
          <label htmlFor="pincode" className="block text-sm font-medium text-foreground mb-1">
            Pincode *
          </label>
          <input
            id="pincode"
            name="pincode"
            type="text"
            required
            value={companyData.pincode}
            onChange={(e) => setCompanyData({ ...companyData, pincode: e.target.value })}
            className="appearance-none relative block w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="Pincode"
          />
        </div>
      </div>
      <div>
        <label htmlFor="country" className="block text-sm font-medium text-foreground mb-1">
          Country *
        </label>
        <input
          id="country"
          name="country"
          type="text"
          required
          value={companyData.country}
          onChange={(e) => setCompanyData({ ...companyData, country: e.target.value })}
          className="appearance-none relative block w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          placeholder="Country"
        />
      </div>
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive text-destructive text-sm rounded-md">
          {error}
        </div>
      )}
    </div>
  );
};

const AdditionalInfoStep = ({
  companyData,
  setCompanyData,
  error,
}: StepProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Additional Information</h3>
      <div>
        <label htmlFor="website" className="block text-sm font-medium text-foreground mb-1">
          Website
        </label>
        <input
          id="website"
          name="website"
          type="url"
          value={companyData.website || ""}
          onChange={(e) => setCompanyData({ ...companyData, website: e.target.value })}
          className="appearance-none relative block w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          placeholder="https://example.com"
        />
      </div>
      <div>
        <label htmlFor="billingAddress" className="block text-sm font-medium text-foreground mb-1">
          Billing Address (if different from company address)
        </label>
        <textarea
          id="billingAddress"
          name="billingAddress"
          value={companyData.billingAddress || ""}
          onChange={(e) => setCompanyData({ ...companyData, billingAddress: e.target.value })}
          className="appearance-none relative block w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary h-24"
          placeholder="Enter billing address if different"
        />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">
          You can customize the appearance and settings of your account later from the settings page.
        </p>
      </div>
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive text-destructive text-sm rounded-md">
          {error}
        </div>
      )}
    </div>
  );
};

const SubscriptionStep = ({
  subscriptionData,
  setSubscriptionData,
  error,
}: SubscriptionStepProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Choose Your Plan</h3>
      <div className="grid gap-4 md:grid-cols-3">
        <div 
          className={`border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors ${
            subscriptionData.plan === 'FREE' ? 'border-primary bg-primary/5' : ''
          }`}
          onClick={() => setSubscriptionData({ ...subscriptionData, plan: 'FREE' })}
        >
          <h4 className="text-lg font-medium">Free</h4>
          <p className="text-2xl font-bold mt-2">₹0<span className="text-sm font-normal">/month</span></p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>• Basic inventory management</li>
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
          <p className="text-2xl font-bold mt-2">₹999<span className="text-sm font-normal">/month</span></p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>• Full inventory management</li>
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
          <p className="text-2xl font-bold mt-2">₹2,499<span className="text-sm font-normal">/month</span></p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>• Advanced inventory management</li>
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

const steps = [
  { id: "company-info", label: "Company Info", icon: "📋", number: 1 },
  { id: "address", label: "Address", icon: "🏢", number: 2 },
  { id: "additional", label: "Additional", icon: "✨", number: 3 },
  { id: "subscription", label: "Subscription", icon: "💰", number: 4 },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const [companyData, setCompanyData] = useState<CompanyData>({
    name: "",
    gstin: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    website: "",
    billingAddress: "",
    logo: "",
    theme: "default",
    settings: {}
  });
  
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({
    plan: 'FREE',
    paymentMethod: 'credit',
    isAutoRenew: true
  });

  const validateCurrentStep = () => {
    setError("");
    
    if (currentStepIndex === 0) {
      // Validate company info
      if (!companyData.name) {
        setError("Company name is required");
        return false;
      }
      if (!companyData.email) {
        setError("Business email is required");
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(companyData.email)) {
        setError("Please enter a valid email");
        return false;
      }
      if (!companyData.phone) {
        setError("Phone number is required");
        return false;
      }
    } else if (currentStepIndex === 1) {
      // Validate address
      if (!companyData.address) {
        setError("Street address is required");
        return false;
      }
      if (!companyData.city) {
        setError("City is required");
        return false;
      }
      if (!companyData.state) {
        setError("State is required");
        return false;
      }
      if (!companyData.country) {
        setError("Country is required");
        return false;
      }
      if (!companyData.pincode) {
        setError("Pincode is required");
        return false;
      }
    } else if (currentStepIndex === 2) {
      // Additional info validation (website URL format if provided)
      if (companyData.website && !companyData.website.startsWith("http")) {
        setError("Website URL must start with http:// or https://");
        return false;
      }
    }
    
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prevStep => prevStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prevStep => prevStep - 1);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateCurrentStep()) return;
    
    setIsLoading(true);
    setError("");
    
    try {
      // Create the company
      const companyResponse = await fetch("/api/v1/companies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(companyData),
      });
      
      const companyResult = await companyResponse.json();
      
      if (!companyResponse.ok) {
        throw new Error(companyResult.error || "Failed to create company");
      }
      
      // Set up the subscription (if not on the free plan, or even for free plan to record it)
      const subscriptionResponse = await fetch(`/api/v1/companies?companyId=${companyResult.id}`, {
        method: "POST_SUBSCRIPTION", // This matches your API route naming
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subscriptionData),
      });
      
      const subscriptionResult = await subscriptionResponse.json();
      
      if (!subscriptionResponse.ok) {
        throw new Error(subscriptionResult.error || "Failed to set up subscription");
      }
      
      // Success! Redirect to the dashboard
      router.push("/dashboard");
    } catch (err) {
      console.error("Onboarding error:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred during company setup");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStepIndex) {
      case 0:
        return (
          <CompanyInfoStep 
            companyData={companyData}
            setCompanyData={setCompanyData}
            error={error}
          />
        );
      case 1:
        return (
          <AddressStep 
            companyData={companyData}
            setCompanyData={setCompanyData}
            error={error}
          />
        );
      case 2:
        return (
          <AdditionalInfoStep 
            companyData={companyData}
            setCompanyData={setCompanyData}
            error={error}
          />
        );
      case 3:
        return (
          <SubscriptionStep 
            subscriptionData={subscriptionData}
            setSubscriptionData={setSubscriptionData}
            error={error}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="max-w-3xl w-full space-y-8">
        <div className="text-center">
          <Link href="/">
            <Image
              src="/logo.svg" 
              alt="FactoStack Logo"
              width={200}
              height={80}
              className="mx-auto h-24 w-auto"
              priority
            />
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-foreground">
            Set up your company
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Complete your profile to get started with FactoStack
          </p>
        </div>

        {/* Enhanced stepper UI with numbers and icons */}
        <div className="py-8 px-4">
          <div className="w-full flex flex-wrap justify-between mb-8 relative">
            <div className="absolute top-1/3 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2" aria-hidden="true"></div>
            
            {steps.map((step, idx) => (
              <div key={step.id} className="relative flex flex-col items-center">
                <div className={`
                  flex items-center justify-center w-14 h-14 rounded-full 
                  ${idx < currentStepIndex 
                    ? "bg-green-500 text-white" 
                    : idx === currentStepIndex 
                      ? "bg-primary text-white ring-4 ring-primary/30" 
                      : "bg-gray-200 text-gray-500"
                  } z-10 transition-all duration-200
                `}>
                  {idx < currentStepIndex ? (
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-lg font-semibold">{step.number}</span>
                    </div>
                  )}
                </div>
                <div className={`
                  mt-3 text-center
                  ${idx < currentStepIndex 
                    ? "text-green-600 font-medium" 
                    : idx === currentStepIndex 
                      ? "text-primary font-semibold" 
                      : "text-gray-500"
                  }
                `}>
                  <span className="text-sm font-medium">{step.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border shadow-sm">
          <form onSubmit={currentStepIndex === steps.length - 1 ? handleSubmit : handleNext}>
            {renderCurrentStep()}
            
            <div className="mt-8 flex justify-between">
              {currentStepIndex > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={isLoading}
                  className="flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                  Back
                </Button>
              )}
              
              <div className={currentStepIndex === 0 ? "ml-auto" : ""}>
                {currentStepIndex < steps.length - 1 ? (
                  <Button type="submit" className="flex items-center group">
                    Continue
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </Button>
                ) : (
                  <Button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700">
                    {isLoading ? "Setting up your company..." : "Finish Setup"}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}