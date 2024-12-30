import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import "jspdf-autotable";

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
        const subtotal = productDetails.reduce((acc, item) => acc + item.salePrice * item.quantity, 0);
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
    const doc = new jsPDF();

    // Add invoice header
    doc.setFontSize(20);
    doc.text('Invoice', 105, 20, null, null, 'center');
    doc.setFontSize(12);
    doc.text(`Invoice No: ${invoiceData.invoiceNo}`, 20, 30);
    doc.text(`Order Date: ${invoiceData.orderDate}`, 20, 40);

    // Delivery Location
    doc.text('Delivery Location:', 20, 50);
    doc.text(`Address: ${invoiceData.shippingInfo.address}`, 20, 60);
    doc.text(`Apartment: ${invoiceData.shippingInfo.apartment}`, 20, 70);
    doc.text(`Landmark: ${invoiceData.shippingInfo.landmark}`, 20, 80);
    doc.text(`City: ${invoiceData.shippingInfo.city}`, 20, 90);
    doc.text(`State: ${invoiceData.shippingInfo.state}`, 20, 100);
    doc.text(`Mobile Number: ${invoiceData.shippingInfo.mobileNumber}`, 20, 110);
    doc.text(`Email: ${invoiceData.shippingInfo.email}`, 20, 120);
    doc.text(`Type of Address: ${invoiceData.shippingInfo.typeOfAddress}`, 20, 130);

    // Billing Info - Table
    doc.autoTable({
      head: [['Item', 'Price', 'QTY', 'Subtotal']],
      body: invoiceData.items.map((item) => [
        item.name,
        `₹${item.salePrice}`,
        item.quantity,
        `₹${item.salePrice * item.quantity}`
      ]),
      startY: 140,
    });

    // Totals
    doc.text(`Subtotal: ₹${invoiceData.subtotal}`, 150, doc.lastAutoTable.finalY + 10);
    doc.text(`Tips: ₹${invoiceData.tips}`, 150, doc.lastAutoTable.finalY + 20);
    doc.text(`Shipping Cost: ₹${invoiceData.shippingCost}`, 150, doc.lastAutoTable.finalY + 30);
    doc.text(`Tax: ₹${invoiceData.tax}`, 150, doc.lastAutoTable.finalY + 40);
    doc.text(`Grand Total: ₹${invoiceData.grandTotal}`, 150, doc.lastAutoTable.finalY + 50);

    // Footer
    doc.text(`Thank you for shopping with us, ${invoiceData.customerName}!`, 20, doc.lastAutoTable.finalY + 60);
    doc.text('For any inquiries, please contact us at jonoJivan@support.com', 20, doc.lastAutoTable.finalY + 70);
    doc.text('Visit our website: https://www.jonojivangrocery.in', 20, doc.lastAutoTable.finalY + 80);

    // Save the PDF
    doc.save('invoice.pdf');
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
        {/* Other invoice content here as per the previous implementation */}
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
