import { InvoiceTemplateProps } from './types';

export function ModernTemplate({ formData, selectedCustomer }: InvoiceTemplateProps) {
  return (
    <div className="border rounded-md overflow-hidden bg-gradient-to-br from-purple-50 to-blue-50 text-black">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">INVOICE</h1>
          <p className="text-xl font-medium bg-white/20 px-4 py-2 rounded-lg"># {formData.invoiceNumber}</p>
        </div>
      </div>
      
      <div className="p-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">Your Company Name</h1>
            <div className="text-sm mt-2">
              <p>Company Address Line 1</p>
              <p>City, State, ZIP</p>
              <p>GSTIN: 12ABCDE1234F1Z5</p>
              <p>contact@yourcompany.com</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-semibold"># {formData.invoiceNumber}</p>
            <p className="mt-2">Invoice Date: {new Date(formData.invoiceDate).toLocaleDateString()}</p>
            <p>Due Date: {new Date(formData.dueDate).toLocaleDateString()}</p>
          </div>
        </div>
        
        <div className="mt-8">
          <p className="font-bold">Bill To:</p>
          {selectedCustomer ? (
            <div className="mt-1">
              <p>{selectedCustomer.name}</p>
              <p>{selectedCustomer.address}</p>
              <p>GSTIN: {selectedCustomer.gstin}</p>
              <p>{selectedCustomer.email}</p>
            </div>
          ) : (
            <p className="text-gray-500">No customer selected</p>
          )}
        </div>
        
        <div className="mt-8">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 text-gray-500 uppercase text-sm">Description</th>
                <th className="text-right py-3 text-gray-500 uppercase text-sm">Qty</th>
                <th className="text-right py-3 text-gray-500 uppercase text-sm">Price</th>
                <th className="text-right py-3 text-gray-500 uppercase text-sm">Tax</th>
                <th className="text-right py-3 text-gray-500 uppercase text-sm">Amount</th>
              </tr>
            </thead>
            <tbody>
              {formData.items.map((item) => (
                <tr key={item.id} className="border-b border-gray-100">
                  <td className="py-4">
                    <div>{item.description || "Product description"}</div>
                  </td>
                  <td className="text-right py-4">{item.quantity} {item.unit}</td>
                  <td className="text-right py-4">₹{item.price.toFixed(2)}</td>
                  <td className="text-right py-4">{item.tax}%</td>
                  <td className="text-right py-4">₹{(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="bg-gray-50 p-6 flex justify-end">
          <div className="w-1/3">
            <div className="flex justify-between py-2 text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span>₹{formData.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 text-sm border-b border-gray-200">
              <span className="text-gray-600">Tax</span>
              <span>₹{formData.taxTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-3 font-semibold">
              <span>Total</span>
              <span>₹{formData.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        {formData.notes && (
          <div className="p-6 border-t border-gray-100">
            <p className="text-gray-500 uppercase text-sm mb-2">Notes</p>
            <p className="text-sm">{formData.notes}</p>
          </div>
        )}
        
        <div className="bg-primary/10 p-6 text-center">
          <p className="text-sm">Thank you for your business!</p>
        </div>
      </div>
    </div>
  );
}