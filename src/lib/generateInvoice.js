import React from "react";

const Invoice = ({ invoiceData }) => {
  const {
    invoiceNo,
    orderDate,
    location,
    shippingInfo,
    items,
    subtotal,
    tips,
    shippingCost,
    tax,
    grandTotal,
    customerName,
  } = invoiceData;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Invoice</h1>
        <p>Invoice No: {invoiceNo}</p>
        <p>Order Date: {orderDate}</p>
      </div>

      {/* Location Info */}
      <div className="mb-6">
        <h2 className="font-semibold">Default Location</h2>
        <p>{location}</p>
      </div>

      {/* Shipping Info */}
      <div className="mb-6">
        <h2 className="font-semibold">Shipping Information</h2>
        <p>Logistic: {shippingInfo.logistic}</p>
        <p>Delivery Type: {shippingInfo.deliveryType}</p>
      </div>

      {/* Billing Info */}
      <div className="mb-6">
        <h2 className="font-semibold">Billing Information</h2>
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Item</th>
              <th className="border border-gray-300 p-2">Price</th>
              <th className="border border-gray-300 p-2">QTY</th>
              <th className="border border-gray-300 p-2">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="text-center">
                <td className="border border-gray-300 p-2">{item.name}</td>
                <td className="border border-gray-300 p-2">₹{item.price}</td>
                <td className="border border-gray-300 p-2">{item.quantity}</td>
                <td className="border border-gray-300 p-2">₹{item.subtotal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="text-right mt-6">
        <p>Subtotal: ₹{subtotal}</p>
        <p>Tips: ₹{tips}</p>
        <p>Shipping Cost: ₹{shippingCost}</p>
        <p>Tax: ₹{tax}</p>
        <h2 className="text-lg font-bold">Grand Total: ₹{grandTotal}</h2>
      </div>

      {/* Footer */}
      <div className="mt-8">
        <p>Hello {customerName},</p>
        <p>
          Thank you for shopping from our store! If you have any questions,
          suggestions, or concerns, please do not hesitate to contact us.
        </p>
        <p>Email: jonoJivan@support.com</p>
        <p>Website: <a href="https://www.jonojivangrocery.in" className="text-blue-500">https://www.jonojivangrocery.in</a></p>
      </div>
    </div>
  );
};

export default Invoice;
