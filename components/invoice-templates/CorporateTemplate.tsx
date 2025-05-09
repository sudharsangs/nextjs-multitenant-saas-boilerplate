import { InvoiceTemplateProps } from './types';

export function CorporateTemplate({ formData, selectedCustomer }: InvoiceTemplateProps) {
  return (
    <div className="border rounded-md bg-white text-black">
      <div className="bg-blue-900 text-white p-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">Your Company Name</h1>
            <div className="text-sm mt-2 text-blue-200">
              <p>Company Address Line 1</p>
              <p>City, State, ZIP</p>
              <p>GSTIN: 12ABCDE1234F1Z5</p>
              <p>contact@yourcompany.com</p>
            </div>
          </div>
          <div className="text-right">
            <div className="inline-block bg-white text-blue-900 p-4 rounded">
              <h2 className="text-xl font-bold mb-2">INVOICE</h2>
              <div className="text-sm">
                <p><span className="text-blue-700">Invoice #:</span> {formData.invoiceNumber}</p>
                <p><span className="text-blue-700">Date:</span> {new Date(formData.invoiceDate).toLocaleDateString()}</p>
                <p><span className="text-blue-700">Due:</span> {new Date(formData.dueDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-8">
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
          <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">Item & Description</th>
                  <th className="text-center py-3 px-4 text-gray-700 font-semibold">Qty</th>
                  <th className="text-right py-3 px-4 text-gray-700 font-semibold">Unit Price</th>
                  <th className="text-right py-3 px-4 text-gray-700 font-semibold">Tax</th>
                  <th className="text-right py-3 px-4 text-gray-700 font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody>
                {formData.items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-200">
                    <td className="py-4 px-4">
                      <div className="font-medium">{item.description || "Product description"}</div>
                    </td>
                    <td className="text-center py-4 px-4">{item.quantity} {item.unit}</td>
                    <td className="text-right py-4 px-4">₹{item.price.toFixed(2)}</td>
                    <td className="text-right py-4 px-4">{item.tax}%</td>
                    <td className="text-right py-4 px-4">₹{(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <div className="w-1/3 bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Subtotal:</span>
              <span>₹{formData.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Tax Amount:</span>
              <span>₹{formData.taxTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-3 font-bold text-blue-900">
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
        
        <div className="mt-8 text-center text-blue-900">
          <p className="font-medium">Thank you for your business!</p>
        </div>
      </div>
    </div>
  );
}