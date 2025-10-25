"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CompanyData, SubscriptionData } from "@/components/onboarding/types";
import { SubscriptionStep } from "@/components/onboarding/subscription-step";
import { AdditionalInfoStep } from "@/components/onboarding/additional-info-step";
import { AddressStep } from "@/components/onboarding/address-step";
import { CompanyInfoStep } from "@/components/onboarding/company-info-step";

const steps = [
  { id: "company-info", label: "Company Info", icon: "📋", number: 1 },
  { id: "address", label: "Address", icon: "🏢", number: 2 },
  { id: "additional", label: "Additional", icon: "✨", number: 3 },
  { id: "subscription", label: "Subscription", icon: "💰", number: 4 },
];

enum FlowType {
  FULL_ONBOARDING = 'full_onboarding',
  SUBSCRIPTION_ONLY = 'subscription_only',
  NO_FLOW_NEEDED = 'no_flow_needed'
}

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Start with loading state
  const [flowType, setFlowType] = useState<FlowType>(FlowType.FULL_ONBOARDING);

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
    isAutoRenew: true,
    duration: 'monthly'
  });

  // Fetch user's company and subscription data on page load
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        // Fetch company details
        const companyResponse = await fetch("/api/v1/companies/current", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const hasCompany = companyResponse.ok;
        let companyId;

        if (hasCompany) {
          const companyResult = await companyResponse.json();
          companyId = companyResult.id;
          setCompanyData({
            ...companyData,
            ...companyResult
          });
        }

        // Fetch subscription details if company exists
        let hasSubscription = false;
        if (hasCompany && companyId) {
          const subscriptionResponse = await fetch(`/api/v1/subscriptions`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          hasSubscription = subscriptionResponse.ok;

          if (hasSubscription) {
            const subscriptionResult = await subscriptionResponse.json();
            setSubscriptionData({
              ...subscriptionData,
              ...subscriptionResult
            });
          }
        }

        // Determine the flow type based on what the user has
        if (hasCompany && hasSubscription) {
          // User has both company and subscription - redirect to dashboard
          setFlowType(FlowType.NO_FLOW_NEEDED);
          router.push("/dashboard");
        } else if (hasCompany && !hasSubscription) {
          // User has company but no subscription - show subscription flow only
          setFlowType(FlowType.SUBSCRIPTION_ONLY);
          setCurrentStepIndex(3); // Set to subscription step
        } else {
          // User has neither - show full onboarding flow
          setFlowType(FlowType.FULL_ONBOARDING);
        }
      } catch (err) {
        // If there's an error, default to full onboarding flow
        setFlowType(FlowType.FULL_ONBOARDING);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  // Step components for the onboarding process
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

  const handleNext = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!validateCurrentStep()) return;

    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prevStep: number) => prevStep + 1);
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
      if (flowType === FlowType.FULL_ONBOARDING) {
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

        // Set up the subscription
        const subscriptionResponse = await fetch(`/api/v1/subscriptions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(subscriptionData),
        });

        const subscriptionResult = await subscriptionResponse.json();

        if (!subscriptionResponse.ok) {
          throw new Error(subscriptionResult.error || "Failed to set up subscription");
        }
      } else if (flowType === FlowType.SUBSCRIPTION_ONLY) {
        // Only set up subscription for existing company
        const subscriptionResponse = await fetch(`/api/v1/subscriptions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(subscriptionData),
        });

        const subscriptionResult = await subscriptionResponse.json();

        if (!subscriptionResponse.ok) {
          throw new Error(subscriptionResult.error || "Failed to set up subscription");
        }
      }

      // Success! Redirect to the dashboard
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred during setup");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while checking user status
  if (isLoading && flowType !== FlowType.NO_FLOW_NEEDED) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your account details...</p>
        </div>
      </div>
    );
  }

  // Content for subscription-only flow
  const subscriptionOnlyTitle = "Choose Your Subscription Plan";
  const subscriptionOnlyDescription = "Select a plan that fits your business needs";

  // Content for full onboarding flow
  const fullOnboardingTitle = "Set up your company";
  const fullOnboardingDescription = "Complete your profile to get started with FactoStack";

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
            {flowType === FlowType.SUBSCRIPTION_ONLY ? subscriptionOnlyTitle : fullOnboardingTitle}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {flowType === FlowType.SUBSCRIPTION_ONLY ? subscriptionOnlyDescription : fullOnboardingDescription}
          </p>
        </div>

        {/* Only show the stepper for full onboarding flow */}
        {flowType === FlowType.FULL_ONBOARDING && (
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
        )}

        <div className="bg-card p-6 rounded-lg border shadow-sm">
          <form onSubmit={currentStepIndex === steps.length - 1 || flowType === FlowType.SUBSCRIPTION_ONLY ? handleSubmit : handleNext}>
            {flowType === FlowType.SUBSCRIPTION_ONLY ? (
              <SubscriptionStep
                subscriptionData={subscriptionData}
                setSubscriptionData={setSubscriptionData}
                error={error}
              />
            ) : (
              renderCurrentStep()
            )}

            <div className="mt-8 flex justify-between">
              {currentStepIndex > 0 && flowType !== FlowType.SUBSCRIPTION_ONLY && (
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

              <div className={(currentStepIndex === 0 || flowType === FlowType.SUBSCRIPTION_ONLY) ? "ml-auto" : ""}>
                {currentStepIndex < steps.length - 1 && flowType !== FlowType.SUBSCRIPTION_ONLY ? (
                  <Button
                    type="submit"
                    className="flex items-center group"
                  >
                    Continue
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </Button>
                ) : (
                  <Button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700">
                    {isLoading ? "Setting up..." : flowType === FlowType.SUBSCRIPTION_ONLY ? "Subscribe & Continue" : "Finish Setup"}
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