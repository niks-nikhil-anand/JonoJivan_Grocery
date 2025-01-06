import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import "jspdf-autotable";

const GenerateInvoice = ({ orderId }) => {
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        // Fetch the order by ID
        const orderResponse = await axios.get(`/api/admin/dashboard/orders/${orderId}`);
        const order = orderResponse.data;

        // Fetch the cart items based on the order's cart ID
        const cartResponse = await axios.get(`/api/users/cart/cartId/${order.cart}`);
        const cartItems = cartResponse.data.cart.items || [];

        // Fetch product details for each item in the cart
        const productDetails = await Promise.all(
          cartItems.map(async (item) => {
            const productResponse = await axios.get(`/api/admin/dashboard/product/${item.productId}`);
            return { ...productResponse.data, quantity: item.quantity || 1 };
          })
        );

        // Fetch the shipping address
        const addressResponse = await axios.get(`/api/savedAddress/${order.address}`);
        const shippingInfo = addressResponse.data;

        // Calculate totals
        const subtotal = productDetails.reduce((acc, item) => acc + item.salePrice * item.quantity, 0);
        const tips = order.tips || 0;
        const shippingCost = order.shippingCost || 0;
        const tax = order.tax || 0;
        const grandTotal = subtotal + tips + shippingCost + tax;

        // Populate the invoice data
        setInvoiceData({
          invoiceNo: order.invoiceNo || `INV-${orderId}`,
          orderDate: new Date(order.createdAt).toLocaleDateString(),
          customerName: order.customerName || "Customer",
          shippingInfo: {
            address: shippingInfo.address || "N/A",
            apartment: shippingInfo.apartment || "N/A",
            landmark: shippingInfo.landmark || "N/A",
            city: shippingInfo.city || "N/A",
            state: shippingInfo.state || "N/A",
            mobileNumber: shippingInfo.mobileNumber || "N/A",
            email: shippingInfo.email || "N/A",
            typeOfAddress: shippingInfo.typeOfAddress || "N/A",
          },
          items: productDetails,
          subtotal,
          tips,
          shippingCost,
          tax,
          grandTotal,
        });
      } catch (error) {
        console.error('Error fetching invoice data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchInvoiceData();
  }, [orderId]);

  if (loading) {
    return <p className="h-screen w-full flex justify-center items-center font-bold">Generating Invoice...</p>;
  }

  if (!invoiceData) {
    return <p>No invoice data available.</p>;
  }

  const downloadPDF = () => {
    const doc = new jsPDF();
  
    // Header
    doc.setFontSize(24);
    doc.setTextColor(50, 50, 50); // Gray color
    doc.text('JonoJivan Grocery', 105, 20, null, null, 'center');
  
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0); // Black color
    doc.text('Invoice', 105, 30, null, null, 'center');
  
    doc.setFontSize(12);
    doc.text(`Invoice No: #${invoiceData.invoiceNo}`, 20, 40);
    doc.text(`Order Date: ${invoiceData.orderDate}`, 150, 40);
  
    // Shipping Information Section
    doc.setFontSize(14);
    doc.setTextColor(50, 50, 50);
    doc.text('SHIPPING INFORMATION', 20, 50);
  
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Black color for content
    const shippingDetails = [
      `Location: ${invoiceData.shippingInfo.address}, ${invoiceData.shippingInfo.city}, ${invoiceData.shippingInfo.state}`,
      `Phone: +91 ${invoiceData.shippingInfo.mobileNumber}`,
      `Delivery Type: ${invoiceData.deliveryType || 'Scheduled'}`,
    ];
    let yPos = 60;
    shippingDetails.forEach((line) => {
      doc.text(line, 20, yPos);
      yPos += 10;
    });
  
    // Billing Information Section
    yPos += 10;
    doc.setFontSize(14);
    doc.setTextColor(50, 50, 50);
    doc.text('BILLING INFORMATION', 20, yPos);
  
    doc.autoTable({
      head: [['Item', 'Price (Rs)', 'Quantity', 'Subtotal (Rs)']],
      body: invoiceData.items.map((item) => [
        item.name,
        `Rs ${item.salePrice.toFixed(2)}`,
        item.quantity,
        `Rs ${(item.salePrice * item.quantity).toFixed(2)}`,
      ]),
      startY: yPos + 10,
      styles: {
        textColor: [0, 0, 0], // Black color for table text
        lineColor: [50, 50, 50], // Gray color for table borders
      },
      headStyles: {
        fillColor: [50, 50, 50], // Gray color for table header background
        textColor: [255, 255, 255], // White color for header text
      },
    });
  
    // Totals Section
    yPos = doc.lastAutoTable.finalY + 10;
    const totals = [
      { label: 'Subtotal:', value: `Rs ${invoiceData.subtotal.toFixed(2)}` },
      { label: 'Tips:', value: `Rs ${invoiceData.tips.toFixed(2)}` },
      { label: 'Shipping Cost:', value: `Rs ${invoiceData.shippingCost.toFixed(2)}` },
      { label: 'Tax:', value: `Rs ${invoiceData.tax.toFixed(2)}` },
      { label: 'Grand Total:', value: `Rs ${invoiceData.grandTotal.toFixed(2)}` },
    ];
    totals.forEach((total) => {
      doc.setFontSize(12);
      doc.setTextColor(50, 50, 50); // Gray color for labels
      doc.text(total.label, 150, yPos);
  
      doc.setTextColor(0, 0, 0); // Black color for values
      doc.text(total.value, 200, yPos, null, null, 'right');
      yPos += 10;
    });
  
    // Footer
    yPos += 20;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Hello ${invoiceData.customerName},`, 20, yPos);
    yPos += 10;
    doc.text(
      'Thank you for shopping from our store! It is great to have you as one of our valued customers.',
      20,
      yPos,
      { maxWidth: 170 }
    );
    yPos += 20;
    doc.text('For any questions, suggestions, or concerns, please contact us:', 20, yPos);
    yPos += 10;
    doc.text('Email: jonojivan@support.com', 20, yPos);
    doc.text('Website: https://jonojivangrocery.in', 20, yPos + 10);
  
    // Save the PDF
    doc.save('invoice.pdf');
  };
  
  

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Invoice</h1>
        <p>Invoice No: {invoiceData.invoiceNo}</p>
        <p>Order Date: {invoiceData.orderDate}</p>
      </div>

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

export default GenerateInvoice;
