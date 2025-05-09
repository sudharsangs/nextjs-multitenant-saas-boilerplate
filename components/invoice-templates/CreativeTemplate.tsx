import { InvoiceTemplateProps } from './types';

export function CreativeTemplate({ formData, selectedCustomer }: InvoiceTemplateProps) {
  return (
    <div className="border rounded-md overflow-hidden bg-gradient-to-br from-purple-100 via-white to-purple-50 text-black">
      <div className="bg-gradient-to-r from-purple-600 to-purple-900 p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent)] pointer-events-none"></div>
        <div className="flex justify-between items-start relative z-10">
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-100 to-white">Your Company Name</h1>
            <div className="text-sm mt-2 text-purple-200">
              <p>Company Address Line 1</p>
              <p>City, State, ZIP</p>
              <p>GSTIN: 12ABCDE1234F1Z5</p>
              <p>contact@yourcompany.com</p>
            </div>
          </div>
          <div className="text-right">
            <div className="inline-block bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
              <h2 className="text-xl font-bold mb-2">INVOICE</h2>
              <div className="text-sm">
                <p>No: {formData.invoiceNumber}</p>
                <p>Date: {new Date(formData.invoiceDate).toLocaleDateString()}</p>
                <p>Due: {new Date(formData.dueDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-8">
        <div className="mt-4">
          <h3 className="text-purple-900 font-medium mb-3">BILL TO</h3>
          {selectedCustomer ? (
            <div>
              <p className="font-semibold text-purple-800">{selectedCustomer.name}</p>
              <div className="mt-1 text-sm text-purple-700">
                <p>{selectedCustomer.address}</p>
                <p><span className="text-purple-600">GSTIN:</span> {selectedCustomer.gstin}</p>
                <p>{selectedCustomer.email}</p>
              </div>
            </div>
          ) : (
            <p className="text-purple-400">No customer selected</p>
          )}
        </div>
        
        <div className="mt-8">
          <div className="bg-white/50 backdrop-blur-sm border border-purple-100 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-purple-50">
                  <th className="text-left py-3 px-4 text-purple-900 font-medium">Item & Description</th>
                  <th className="text-center py-3 px-4 text-purple-900 font-medium">Qty</th>
                  <th className="text-right py-3 px-4 text-purple-900 font-medium">Unit Price</th>
                  <th className="text-right py-3 px-4 text-purple-900 font-medium">Tax</th>
                  <th className="text-right py-3 px-4 text-purple-900 font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {formData.items.map((item) => (
                  <tr key={item.id} className="border-b border-purple-50">
                    <td className="py-4 px-4">
                      <div className="font-medium text-purple-900">{item.description || "Product description"}</div>
                    </td>
                    <td className="text-center py-4 px-4 text-purple-800">{item.quantity} {item.unit}</td>
                    <td className="text-right py-4 px-4 text-purple-800">₹{item.price.toFixed(2)}</td>
                    <td className="text-right py-4 px-4 text-purple-800">{item.tax}%</td>
                    <td className="text-right py-4 px-4 text-purple-800">₹{(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <div className="w-1/3 bg-purple-50/50 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex justify-between py-2 text-sm">
              <span className="text-purple-700">Subtotal</span>
              <span className="text-purple-900">₹{formData.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 text-sm border-b border-purple-100">
              <span className="text-purple-700">Tax</span>
              <span className="text-purple-900">₹{formData.taxTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-3 font-bold">
              <span className="text-purple-900">Total</span>
              <span className="text-purple-900">₹{formData.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        {formData.notes && (
          <div className="mt-8 border-t border-purple-100 pt-4">
            <p className="text-purple-800 font-medium mb-2">Notes</p>
            <p className="text-sm text-purple-700">{formData.notes}</p>
          </div>
        )}
        
        <div className="mt-8 text-center">
          <p className="text-purple-700 font-medium">Thank you for your business!</p>
        </div>
      </div>
    </div>
  );
}