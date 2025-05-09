import { InvoiceTemplateProps } from './types';

export function ProfessionalTemplate({ formData, selectedCustomer, paymentTermsOptions }: InvoiceTemplateProps) {
  return (
    <div className="border rounded-md p-8 bg-white text-black">
      <div className="flex justify-between items-start border-b-2 border-navy-800 pb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Your Company Name</h1>
          <div className="text-sm mt-2 text-navy-700">
            <p>Company Address Line 1</p>
            <p>City, State, ZIP</p>
            <p>GSTIN: 12ABCDE1234F1Z5</p>
            <p>contact@yourcompany.com</p>
          </div>
        </div>
        <div className="text-right">
          <div className="inline-block border-2 border-navy-200 p-4 rounded bg-navy-50">
            <h2 className="text-xl font-semibold mb-2 text-navy-800">INVOICE</h2>
            <div className="text-sm">
              <p><span className="text-navy-600">Invoice #:</span> {formData.invoiceNumber}</p>
              <p><span className="text-navy-600">Date:</span> {new Date(formData.invoiceDate).toLocaleDateString()}</p>
              <p><span className="text-navy-600">Due:</span> {new Date(formData.dueDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h3 className="text-gray-600 font-medium mb-3">BILL TO</h3>
        {selectedCustomer ? (
          <div>
            <p className="font-semibold">{selectedCustomer.name}</p>
            <div className="mt-1 text-sm">
              <p>{selectedCustomer.address}</p>
              <p><span className="text-gray-600">GSTIN:</span> {selectedCustomer.gstin}</p>
              <p>{selectedCustomer.email}</p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No customer selected</p>
        )}
      </div>
      
      <div className="mt-8">
        <div className="bg-gray-100 border border-gray-300">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-200">
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Item & Description</th>
                <th className="text-center py-3 px-4 text-gray-700 font-semibold">Qty</th>
                <th className="text-right py-3 px-4 text-gray-700 font-semibold">Unit Price</th>
                <th className="text-right py-3 px-4 text-gray-700 font-semibold">Tax</th>
                <th className="text-right py-3 px-4 text-gray-700 font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {formData.items.map((item) => (
                <tr key={item.id} className="border-b border-gray-300">
                  <td className="py-3 px-4">
                    <div className="font-medium">{item.description || "Product description"}</div>
                  </td>
                  <td className="text-center py-3 px-4">{item.quantity} {item.unit}</td>
                  <td className="text-right py-3 px-4">₹{item.price.toFixed(2)}</td>
                  <td className="text-right py-3 px-4">{item.tax}%</td>
                  <td className="text-right py-3 px-4">₹{(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end">
        <div className="w-1/3 border-t border-gray-300">
          <div className="flex justify-between py-2 px-4">
            <span className="text-gray-600">Subtotal:</span>
            <span>₹{formData.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2 px-4 border-b border-gray-300">
            <span className="text-gray-600">Tax Amount:</span>
            <span>₹{formData.taxTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-3 px-4 font-bold bg-gray-100">
            <span>Total:</span>
            <span>₹{formData.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      {formData.notes && (
        <div className="mt-8 border-t border-gray-200 pt-4">
          <h3 className="text-gray-600 font-medium mb-2">NOTES</h3>
          <p className="text-sm">{formData.notes}</p>
        </div>
      )}
      
      <div className="mt-8 text-center border-t border-gray-200 pt-4">
        <p className="text-gray-600">Payment Terms: {paymentTermsOptions.find(pt => pt.value === formData.paymentTerms)?.label}</p>
        <p className="mt-2 font-medium">Thank you for your business!</p>
      </div>
    </div>
  );
}