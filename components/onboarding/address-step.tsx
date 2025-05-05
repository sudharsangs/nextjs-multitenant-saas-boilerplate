import { useEffect } from "react";
import { StepProps } from "./types";
import { search as pincodeSearch } from "india-pincode-search";


export const AddressStep = ({
    companyData,
    setCompanyData,
    error,
}: StepProps) => {
    // Set country to India by default
    useEffect(() => {
        if (companyData.country !== 'India') {
            setCompanyData({ ...companyData, country: 'India' });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Function to handle pincode change and auto-populate city and state
    const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        // Only allow numeric input
        if (value === '' || /^[0-9]+$/.test(value)) {
            setCompanyData({ ...companyData, pincode: value });

            // Only search when we have a 6-digit pincode
            if (value.length === 6) {
                try {
                    const searchResults = pincodeSearch(value);

                    if (searchResults && searchResults.length > 0) {
                        // Use the first match to update city and state
                        const { district, state } = searchResults[0];
                        setCompanyData(prevData => ({
                            ...prevData,
                            pincode: value,
                            city: district,
                            state: state
                        }));
                    }
                } catch (err) {
                    console.error("Error searching pincode:", err);
                }
            }
        }
    };

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
                <label htmlFor="pincode" className="block text-sm font-medium text-foreground mb-1">
                    Pincode * <span className="text-xs text-muted-foreground">(City and State will auto-fill)</span>
                </label>
                <input
                    id="pincode"
                    name="pincode"
                    type="text"
                    required
                    maxLength={6}
                    pattern="[0-9]{6}"
                    value={companyData.pincode}
                    onChange={handlePincodeChange}
                    className="appearance-none relative block w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Enter 6-digit pincode"
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
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
                        readOnly={!!companyData.pincode && companyData.pincode.length === 6}
                    />
                </div>
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
                        readOnly={!!companyData.pincode && companyData.pincode.length === 6}
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
                    className="appearance-none relative block w-full px-3 py-2 border border-input bg-muted rounded-md cursor-not-allowed"
                    disabled
                />
                <p className="text-xs text-muted-foreground mt-1">Currently, we only operate in India</p>
            </div>
            {error && (
                <div className="p-4 bg-destructive/10 border border-destructive text-destructive text-sm rounded-md">
                    {error}
                </div>
            )}
        </div>
    );
};
