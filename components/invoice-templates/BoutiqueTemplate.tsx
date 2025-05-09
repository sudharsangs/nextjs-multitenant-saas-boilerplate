import { InvoiceTemplateProps } from './types';

export function BoutiqueTemplate({ formData, selectedCustomer, paymentTermsOptions }: InvoiceTemplateProps) {
  return (
    <div className="border rounded-md overflow-hidden bg-gradient-to-br from-rose-50 to-white text-black">
      <div className="border-b border-rose-200">
        <div className="p-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-serif italic text-rose-900">Your Company Name</h1>
              <div className="text-sm mt-2 text-rose-700">
                <p>Company Address Line 1</p>
                <p>City, State, ZIP</p>
                <p>GSTIN: 12ABCDE1234F1Z5</p>
                <p>contact@yourcompany.com</p>
              </div>
            </div>
            <div className="text-right">
              <div className="inline-block bg-white p-6 rounded-lg shadow-lg border border-rose-100">
                <h2 className="text-xl font-serif text-rose-900 mb-2">INVOICE</h2>
                <div className="text-sm">
                  <p><span className="text-rose-700">No:</span> {formData.invoiceNumber}</p>
                  <p><span className="text-rose-700">Date:</span> {new Date(formData.invoiceDate).toLocaleDateString()}</p>
                  <p><span className="text-rose-700">Due:</span> {new Date(formData.dueDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-8">
        <div className="mt-8">
          <h3 className="text-gray-600 font-medium mb-3 italic">BILL TO</h3>
          {selectedCustomer ? (
            <div>
              <p className="font-serif text-lg">{selectedCustomer.name}</p>
              <div className="mt-1 text-sm text-rose-700">
                <p>{selectedCustomer.address}</p>
                <p><span className="text-rose-600">GSTIN:</span> {selectedCustomer.gstin}</p>
                <p>{selectedCustomer.email}</p>
              </div>
            </div>
          ) : (
            <p className="text-rose-300">No customer selected</p>
          )}
        </div>
        
        <div className="mt-8">
          <div className="bg-white border-2 border-rose-100 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="bg-rose-50">
                  <th className="text-left py-3 px-4 text-rose-900 font-serif">Item & Description</th>
                  <th className="text-center py-3 px-4 text-rose-900 font-serif">Qty</th>
                  <th className="text-right py-3 px-4 text-rose-900 font-serif">Unit Price</th>
                  <th className="text-right py-3 px-4 text-rose-900 font-serif">Tax</th>
                  <th className="text-right py-3 px-4 text-rose-900 font-serif">Amount</th>
                </tr>
              </thead>
              <tbody>
                {formData.items.map((item) => (
                  <tr key={item.id} className="border-b border-rose-50">
                    <td className="py-4 px-4">
                      <div className="font-medium text-rose-900">{item.description || "Product description"}</div>
                    </td>
                    <td className="text-center py-4 px-4 text-rose-800">{item.quantity} {item.unit}</td>
                    <td className="text-right py-4 px-4 text-rose-800">₹{item.price.toFixed(2)}</td>
                    <td className="text-right py-4 px-4 text-rose-800">{item.tax}%</td>
                    <td className="text-right py-4 px-4 text-rose-800">₹{(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <div className="w-1/3 bg-white rounded-xl p-6 border-2 border-rose-100 shadow-sm">
            <div className="flex justify-between py-2 text-sm">
              <span className="text-rose-700 font-serif">Subtotal</span>
              <span className="text-rose-900">₹{formData.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 text-sm border-b border-rose-100">
              <span className="text-rose-700 font-serif">Tax</span>
              <span className="text-rose-900">₹{formData.taxTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-3 font-serif text-lg">
              <span className="text-rose-900">Total</span>
              <span className="text-rose-900">₹{formData.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        {formData.notes && (
          <div className="mt-8 border-t-2 border-rose-100 pt-4">
            <p className="text-rose-800 font-serif mb-2">Notes</p>
            <p className="text-sm text-rose-700">{formData.notes}</p>
          </div>
        )}
        
        <div className="mt-8 text-center border-t-2 border-rose-100 pt-4">
          <p className="text-rose-600">Payment Terms: {paymentTermsOptions.find(pt => pt.value === formData.paymentTerms)?.label}</p>
          <p className="mt-2 font-serif text-rose-800">Thank you for your business!</p>
        </div>
      </div>
    </div>
  );
}