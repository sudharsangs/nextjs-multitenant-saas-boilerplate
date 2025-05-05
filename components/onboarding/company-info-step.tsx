import { StepProps } from "./types";

export const CompanyInfoStep = ({
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
