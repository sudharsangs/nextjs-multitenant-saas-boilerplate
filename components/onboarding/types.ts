export interface StepProps {
    companyData: CompanyData;
    setCompanyData: React.Dispatch<React.SetStateAction<CompanyData>>;
    error: string;
}

export interface SubscriptionData {
    plan: 'FREE' | 'BASIC' | 'PRO' | 'ENTERPRISE';
    paymentMethod: string;
    isAutoRenew: boolean;
    duration: 'monthly' | 'quarterly' | 'half-yearly' | 'annual';
}

export interface CompanyData {
  name: string;
  gstin: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  website: string;
  billingAddress: string;
  logo: string;
  theme: string;
  settings: Record<string, unknown>;
}