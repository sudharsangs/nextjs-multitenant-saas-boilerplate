import { InvoiceTemplateProps } from './types';

export function ClassicTemplate({ formData, selectedCustomer }: InvoiceTemplateProps) {
  return (
    <div className="border rounded-md p-8 bg-white text-black">
      <div className="bg-blue-50 -m-8 p-8 mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-blue-800">INVOICE</h1>
            <div className="text-sm mt-4 text-blue-900">
              <p className="font-bold">Your Company Name</p>
              <p>Company Address Line 1</p>
              <p>City, State, ZIP</p>
              <p>GSTIN: 12ABCDE1234F1Z5</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-semibold text-blue-800"># {formData.invoiceNumber}</p>
            <p className="mt-2 text-blue-900">Invoice Date: {new Date(formData.invoiceDate).toLocaleDateString()}</p>
            <p className="text-blue-900">Due Date: {new Date(formData.dueDate).toLocaleDateString()}</p>
          </div>
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
            <tr className="border-b border-gray-300">
              <th className="text-left py-2">Item & Description</th>
              <th className="text-right py-2">Qty</th>
              <th className="text-right py-2">Rate</th>
              <th className="text-right py-2">Tax</th>
              <th className="text-right py-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {formData.items.map((item) => (
              <tr key={item.id} className="border-b border-gray-200">
                <td className="py-3">
                  <div className="font-medium">{item.description || "Product description"}</div>
                </td>
                <td className="text-right py-3">{item.quantity} {item.unit}</td>
                <td className="text-right py-3">₹{item.price.toFixed(2)}</td>
                <td className="text-right py-3">{item.tax}%</td>
                <td className="text-right py-3">₹{(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-6 flex justify-end">
        <div className="w-1/3">
          <div className="flex justify-between py-2">
            <span>Subtotal:</span>
            <span>₹{formData.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span>Tax Total:</span>
            <span>₹{formData.taxTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2 font-bold text-lg">
            <span>Total:</span>
            <span>₹{formData.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <p className="font-medium">Notes:</p>
        <p className="mt-1 text-sm">{formData.notes}</p>
      </div>
      
      <div className="mt-8 text-center text-sm">
        <p>Thank you for your business!</p>
      </div>
    </div>
  );
}