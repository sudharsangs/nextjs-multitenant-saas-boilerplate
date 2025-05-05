export interface StepProps {
    companyData: CompanyData;
    setCompanyData: React.Dispatch<React.SetStateAction<CompanyData>>;
    error: string;
}

export interface SubscriptionData {
    plan: 'FREE' | 'BASIC' | 'PRO';
    paymentMethod: string;
    isAutoRenew: boolean;
    id?: string;
}

export interface CompanyData {
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
  id?: string; // Added ID field for existing companies
}