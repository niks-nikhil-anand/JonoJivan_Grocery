import React from "react";
import { FaEnvelope, FaGlobe } from "react-icons/fa";

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
    <div className="max-w-4xl mx-auto p-8 bg-gradient-to-r from-blue-50 to-green-50 shadow-lg rounded-lg font-sans border border-gray-200">
      {/* Header */}
      <div className="text-center border-b pb-4 mb-8">
        <h1 className="text-4xl font-extrabold text-blue-800">JonoJivan Grocery</h1>
        <p className="text-gray-600 text-lg font-medium">Your Trusted Grocery Partner</p>
        <p className="text-gray-800 mt-2">
          Invoice No: <span className="font-bold text-gray-900">{invoiceNo}</span>
        </p>
        <p className="text-gray-800">
          Order Date: <span className="font-bold text-gray-900">{orderDate}</span>
        </p>
      </div>

      {/* Location Info */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Default Location</h2>
        <p className="text-gray-800">{location}</p>
      </div>

      {/* Shipping Info */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Shipping Information</h2>
        <p className="text-gray-800">Logistic: <span className="font-medium">{shippingInfo.logistic}</span></p>
        <p className="text-gray-800">Delivery Type: <span className="font-medium">{shippingInfo.deliveryType}</span></p>
      </div>

      {/* Billing Info */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Billing Information</h2>
        <table className="w-full table-auto border-collapse rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-blue-100">
              <th className="p-4 text-left text-sm font-medium text-gray-800">Item</th>
              <th className="p-4 text-left text-sm font-medium text-gray-800">Price (₹)</th>
              <th className="p-4 text-left text-sm font-medium text-gray-800">QTY</th>
              <th className="p-4 text-left text-sm font-medium text-gray-800">Subtotal (₹)</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr
                key={index}
                className={`text-gray-700 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100`}
              >
                <td className="p-4">{item.name}</td>
                <td className="p-4">{item.price}</td>
                <td className="p-4">{item.quantity}</td>
                <td className="p-4">{item.subtotal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="text-right mt-8 space-y-3">
        <p className="text-gray-800">Subtotal: <span className="font-bold text-gray-900">₹{subtotal}</span></p>
        <p className="text-gray-800">Tips: <span className="font-bold text-gray-900">₹{tips}</span></p>
        <p className="text-gray-800">Shipping Cost: <span className="font-bold text-gray-900">₹{shippingCost}</span></p>
        <p className="text-gray-800">Tax: <span className="font-bold text-gray-900">₹{tax}</span></p>
        <h2 className="text-2xl font-extrabold text-gray-900">Grand Total: ₹{grandTotal}</h2>
      </div>

      {/* Footer */}
      <div className="mt-12 bg-blue-50 p-6 rounded-lg shadow-inner border-t-2 border-blue-300">
        <p className="text-gray-800 mb-2">
          Hello <span className="font-semibold">{customerName}</span>,
        </p>
        <p className="text-gray-600 mb-4">
          Thank you for shopping with us! If you have any questions, suggestions, or concerns, please feel free to
          reach out.
        </p>
        <div className="flex items-center space-x-8 text-gray-700">
          <div className="flex items-center space-x-2">
            <FaEnvelope />
            <p>support@jonojivangrocery.com</p>
          </div>
          <div className="flex items-center space-x-2">
            <FaGlobe />
            <a
              href="https://www.jonojivangrocery.in"
              className="text-blue-600 hover:underline"
            >
              www.jonojivangrocery.in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
