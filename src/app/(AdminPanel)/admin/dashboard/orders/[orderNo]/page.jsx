"use client";
import React, { useState, useEffect } from "react";
import { FaPrint, FaDownload } from "react-icons/fa";
import axios from "axios";

const Page = () => {
  const [data, setData] = useState(null);
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const urlPath = window.location.pathname;
        const id = urlPath.split("/").pop();

        // Fetch order details
        const orderResponse = await axios.get(`/api/admin/dashboard/orders/${id}`);
        const order = orderResponse.data;

        // Fetch the cart based on the order's cart ID
        const cartResponse = await axios.get(`/api/users/cart/cartId/${order.cart}`);
        const fetchedCart = cartResponse.data.cart.items || [];

        // Fetch product details for each item in the cart
        const productDetails = await Promise.all(
          fetchedCart.map(async (item) => {
            const productResponse = await axios.get(`/api/admin/dashboard/product/${item.productId}`);
            return { ...productResponse.data, quantity: item.quantity || 1 };
          })
        );

        // Fetch shipping information
        const addressResponse = await axios.get(`/api/savedAddress/${order.address}`);
        const shippingInfo = addressResponse.data;

        // Calculate totals
        const subtotal = productDetails.reduce(
          (acc, item) => acc + item.salePrice * item.quantity,
          0
        );
        const tips = order.tips || 0;
        const shippingCost = order.shippingCost || 0;
        const tax = order.tax || 0;
        const grandTotal = subtotal + tips + shippingCost + tax;

        // Prepare invoice data
        const invoice = {
          paymentMethod : order.paymentMethod,
          invoiceNo: order.invoiceNo,
          orderDate: new Date(order.orderDate).toLocaleDateString("en-GB"),
          location: shippingInfo?.landmark || "N/A",
          shippingInfo,
          items: productDetails,
          subtotal,
          tips,
          shippingCost,
          tax,
          grandTotal,
          customerName: order.user?.fullName || "N/A",
        };

        setData(order);
        setInvoiceData(invoice);
      } catch (err) {
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100  p-4 max-h-[70vh]">
      <div className="p-4 border rounded-md shadow-sm bg-white">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Order Details</h2>
          <div className="flex space-x-4">
            {/* Print Button */}
            <button
              className="flex items-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
              onClick={() => window.print()}
            >
              <FaPrint className="mr-2" />
              Print
            </button>

            {/* Download Invoice Button */}
            <button
              className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
              onClick={() =>
                window.open(`/api/admin/dashboard/orders/${data.id}/download`, "_blank")
              }
            >
              <FaDownload className="mr-2" />
              Download Invoice
            </button>
          </div>
        </div>
      </div>

      {/* Order Details Section */}
      <div className="mt-6 p-6 border rounded-md shadow-sm bg-white max-h-[60vh] overflow-y-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h2 className="text-lg font-semibold">
            Invoice <span className="text-orange-600">#{invoiceData?.invoiceNo}</span>
          </h2>
          <div className="flex space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Assign Deliveryman</label>
              <select className="w-40 px-3 py-2 border rounded-md text-gray-700">
                <option>Assign Deliveryman</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Payment Status</label>
              <select className="w-40 px-3 py-2 border rounded-md text-gray-700">
                <option>Unpaid</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Delivery Status</label>
              <select className="w-40 px-3 py-2 border rounded-md text-gray-700">
                <option>Order Placed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Customer Info Section */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Shipping Address</h3>
           
            <p className="text-gray-500">{invoiceData?.shippingInfo?.address || "Not Available"}</p>
            <p className="text-gray-500">{invoiceData?.shippingInfo?.apartment || "Not Available"} ,  {invoiceData?.shippingInfo?.landmark || "Not Available"}</p>
            <p className="text-gray-500">{invoiceData?.shippingInfo?.city} {invoiceData?.shippingInfo?.state} </p>
            <p className="text-gray-500">{invoiceData?.shippingInfo?.state}</p>
            <p className="text-gray-500 font-cormorant">{invoiceData?.shippingInfo?.typeOfAddress}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Contact Info</h3>
            <p className="text-gray-500">{invoiceData?.shippingInfo?.firstName || "Not Available"} {invoiceData?.shippingInfo?.lastName || "Not Available"}</p>
            <p className="text-gray-500">{invoiceData?.shippingInfo?.email || "Not Available"}</p>
            <p className="text-gray-500">+91 {invoiceData?.shippingInfo?.mobileNumber || "Not Available"}</p>
          </div>
        </div>

        {/* Products Table */}
        <div className="overflow-auto mb-4">
          <table className="min-w-full border-collapse border text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 border">S/L</th>
                <th className="px-4 py-2 border">Products</th>
                <th className="px-4 py-2 border">Unit Price</th>
                <th className="px-4 py-2 border">QTY</th>
                <th className="px-4 py-2 border">Total Price</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData?.items?.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 border text-center text-gray-700">{index + 1}</td>
                  <td className="px-4 py-2 border text-gray-700">{item.name}</td>
                  <td className="px-4 py-2 border text-center text-orange-600">{item.salePrice}</td>
                  <td className="px-4 py-2 border text-center text-gray-700">{item.quantity}</td>
                  <td className="px-4 py-2 border text-right text-orange-600">{item.salePrice * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Payment Info Section */}
        <div className="grid grid-cols-4 gap-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Payment Method</h3>
            <p className="text-gray-700">{invoiceData?.paymentMethod}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Logistic</h3>
            <p className="text-gray-700">Delivery By Ekart</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Order Logs</h3>
            <p className="px-2 py-1 bg-green-100 text-green-600 rounded">No logs found</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-right text-gray-700 mb-2">Order Summary</h3>
            <div className="text-right">
              <p className="text-gray-700">Sub Total: ₹{invoiceData?.subtotal}</p>
              <p className="text-gray-700">Tips: ₹{invoiceData?.tips}</p>
              <p className="text-gray-700">Shipping Cost: ₹{invoiceData?.shippingCost}</p>
              <p className="font-semibold text-lg text-orange-600">Grand Total: ₹{invoiceData?.grandTotal}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
