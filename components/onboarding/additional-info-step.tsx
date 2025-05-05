import { StepProps } from "./types";

export const AdditionalInfoStep = ({
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