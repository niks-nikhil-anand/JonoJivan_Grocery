import React, { useEffect, useState } from 'react';
import axios from 'axios';
import html2pdf from 'html2pdf.js';

const GenrerateInvoice = ({ orderId }) => {
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        // Fetch the order by ID
        const orderResponse = await axios.get(`/api/admin/dashboard/orders/${orderId}`);
        const order = orderResponse.data;
        console.log('Order Data:', order); // Log the fetched order data
  
        // Fetch the cart based on the order's cart ID
        const cartResponse = await axios.get(`/api/users/cart/cartId/${order.cart}`);
        const fetchedCart = cartResponse.data.cart.items || [];
        console.log('Fetched Cart Items:', fetchedCart); // Log fetched cart items
  
        // Fetch product details for each item in the cart
        const productDetails = await Promise.all(
          fetchedCart.map(async (item) => {
            const productResponse = await axios.get(`/api/admin/dashboard/product/${item.productId}`);
            return { ...productResponse.data, quantity: item.quantity || 1 };
          })
        );
        console.log('Product Details:', productDetails); // Log product details
  
        // Get the shipping information (address)
        const addressResponse = await axios.get(`/api/savedAddress/${order.address}`);
        console.log('Shipping Info:', addressResponse.data); // Log the shipping info
        const shippingInfo = addressResponse.data;
  
        // Calculate totals and create the invoice data
        const subtotal = productDetails.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const tips = order.tips || 0;
        const shippingCost = order.shippingCost || 0;
        const tax = order.tax || 0;
        const grandTotal = subtotal + tips + shippingCost + tax;
  
        const invoice = {
          invoiceNo: order.invoiceNo,
          orderDate: new Date(order.orderDate).toLocaleDateString('en-GB'),
          location: shippingInfo?.landmark || 'N/A',
          shippingInfo,
          items: productDetails,
          subtotal,
          tips,
          shippingCost,
          tax,
          grandTotal,
          customerName: order.user?.fullName || 'N/A',
        };
  
        console.log('Generated Invoice:', invoice); // Log the generated invoice
  
        setInvoiceData(invoice);
      } catch (error) {
        console.error('Error fetching invoice data:', error);
      } finally {
        setLoading(false);
      }
    };
  
    // Ensure effect is triggered only when orderId is provided
    if (orderId) {
      fetchInvoiceData();
    }
  
  }, [orderId]);
   // This dependency ensures the effect runs when orderId changes

  // Loader while fetching data
  if (loading) {
    return <p>Generating Invoice...</p>;
  }

  // If there's no invoice data
  if (!invoiceData) {
    return <p>No invoice data available.</p>;
  }

  // Function to download the invoice as PDF
  const downloadPDF = () => {
    const invoiceElement = document.getElementById('invoice-content');

    // Using html2pdf to generate the PDF
    html2pdf()
      .from(invoiceElement)
      .save('invoice.pdf');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Invoice</h1>
        <p>Invoice No: {invoiceData.invoiceNo}</p>
        <p>Order Date: {invoiceData.orderDate}</p>
      </div>

      {/* Content to be rendered and downloaded as PDF */}
      <div id="invoice-content">
        {/* Location Info */}
        <div className="mb-6">
        <h2 className="font-semibold">Delivery Location</h2>
          <p><strong>Address:</strong> {invoiceData.shippingInfo.address}</p>
          <p><strong>Apartment:</strong> {invoiceData.shippingInfo.apartment}</p>
          <p><strong>Landmark:</strong> {invoiceData.shippingInfo.landmark}</p>
          <p><strong>City:</strong> {invoiceData.shippingInfo.city}</p>
          <p><strong>State:</strong> {invoiceData.shippingInfo.state}</p>
          <p><strong>Mobile Number:</strong> {invoiceData.shippingInfo.mobileNumber}</p>
          <p><strong>Email:</strong> {invoiceData.shippingInfo.email}</p>
          <p><strong>Type of Address:</strong> {invoiceData.shippingInfo.typeOfAddress}</p>
        </div>

        {/* Shipping Info */}
        <div className="mb-6">
          <h2 className="font-semibold">Shipping Information</h2>
          <p>Logistic: {invoiceData.shippingInfo.logistic}</p>
          <p>Delivery Type: {invoiceData.shippingInfo.deliveryType}</p>
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
              {invoiceData.items.map((item, index) => (
                <tr key={index} className="text-center">
                  <td className="border border-gray-300 p-2">{item.name}</td>
                  <td className="border border-gray-300 p-2">₹{item.salePrice}</td>
                  <td className="border border-gray-300 p-2">{item.quantity}</td>
                  <td className="border border-gray-300 p-2">₹{item.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="text-right mt-6">
          <p>Subtotal: ₹{invoiceData.subtotal}</p>
          <p>Tips: ₹{invoiceData.tips}</p>
          <p>Shipping Cost: ₹{invoiceData.shippingCost}</p>
          <p>Tax: ₹{invoiceData.tax}</p>
          <h2 className="text-lg font-bold">Grand Total: ₹{invoiceData.grandTotal}</h2>
        </div>

        {/* Footer */}
        <div className="mt-8">
          <p>Hello {invoiceData.customerName},</p>
          <p>
            Thank you for shopping from our store! If you have any questions,
            suggestions, or concerns, please do not hesitate to contact us.
          </p>
          <p>Email: jonoJivan@support.com</p>
          <p>Website: <a href="https://www.jonojivangrocery.in" className="text-blue-500">https://www.jonojivangrocery.in</a></p>
        </div>
      </div>

      {/* Download Button */}
      <div className="text-center mt-8">
        <button
          onClick={downloadPDF}
          className="px-6 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600"
        >
          Download as PDF
        </button>
      </div>
    </div>
  );
};

export default GenrerateInvoice;
