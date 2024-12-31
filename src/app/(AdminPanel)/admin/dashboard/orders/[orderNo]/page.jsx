"use client";
import React, { useState, useEffect } from "react";
import { FaPrint, FaDownload } from "react-icons/fa";
import axios from "axios";
import { toast } from 'react-hot-toast';


const Page = () => {
  const [data, setData] = useState(null);
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [orderStatus, setOrderStatus] = useState("");

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
          paymentStatus: order.paymentStatus,
          orderStatus: order.orderStatus,
          paymentMethod : order.paymentMethod,
          razorpay_order_id : order.razorpay_order_id,
          razorpay_payment_id : order.razorpay_payment_id,
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

  const handleStatusChange = async (type, value) => {
    try {
      const urlPath = window.location.pathname;
      const id = urlPath.split("/").pop();
  
      const updatedData =
        type === "paymentStatus"
          ? { paymentStatus: value }
          : { orderStatus: value };
  
      await axios.patch(`/api/admin/dashboard/orders/${id}`, updatedData);
  
      if (type === "paymentStatus") {
        setPaymentStatus(value);
      } else {
        setOrderStatus(value);
      }
  
      // Show success toast
      toast.success(`${type === "paymentStatus" ? "Payment status" : "Order status"} updated successfully!`);
    } catch (error) {
      console.error("Failed to update status", error);
  
      // Show error toast
      toast.error("Failed to update status. Please try again.");
    }
  };
  

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
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h2 className="text-lg font-semibold">
            Invoice <span className="text-orange-600">#{invoiceData?.invoiceNo}</span>
          </h2>
          <div className="flex space-x-4">
      
          <div>
  <label className="block text-sm font-medium text-gray-700">Payment Status</label>
  <select
    className="w-40 px-3 py-2 border rounded-md text-gray-700"
    value={paymentStatus || invoiceData?.paymentStatus || ""}
    onChange={(e) => handleStatusChange("paymentStatus", e.target.value)}
  >
    <option value="" disabled>
      Select
    </option>
    <option value="Unpaid">Unpaid</option>
    <option value="Paid">Paid</option>
  </select>
</div>
<div>
  <label className="block text-sm font-medium text-gray-700">Order Status</label>
  <select
    className="w-40 px-3 py-2 border rounded-md text-gray-700"
    value={orderStatus || invoiceData?.orderStatus || ""}
    onChange={(e) => handleStatusChange("orderStatus", e.target.value)}
  >
    <option value="" disabled>
      Select
    </option>
    <option value="Pending">Pending</option>
    <option value="OrderPlaced">Order Placed</option>
    <option value="Processing">Processing</option>
    <option value="PickedUp">Picked Up</option>
    <option value="OutForDelivery">Out For Delivery</option>
    <option value="Delivered">Delivered</option>
    <option value="Cancelled">Cancelled</option>
  </select>
</div>


          </div>
        </div>

        {/* Customer Info Section */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Shipping Address({invoiceData?.shippingInfo?.typeOfAddress})</h3>
           
            <p className="text-gray-500">{invoiceData?.shippingInfo?.address || "Not Available"}</p>
            <p className="text-gray-500">{invoiceData?.shippingInfo?.apartment || "Not Available"} ,  {invoiceData?.shippingInfo?.landmark || "Not Available"}</p>
            <p className="text-gray-500">{invoiceData?.shippingInfo?.city} {invoiceData?.shippingInfo?.state} </p>
            <p className="text-gray-500">{invoiceData?.shippingInfo?.pinCode}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Contact Info</h3>
            <p className="text-gray-500">{invoiceData?.shippingInfo?.firstName || "Not Available"} {invoiceData?.shippingInfo?.lastName || "Not Available"}</p>
            <p className="text-gray-500">{invoiceData?.shippingInfo?.email || "Not Available"}</p>
            <p className="text-gray-500">+91 {invoiceData?.shippingInfo?.mobileNumber || "Not Available"}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Razorpay Info</h3>
            <p className="text-gray-500">razorpay_order_id :-   {invoiceData?.razorpay_order_id || "Not Available"} </p>
            <p className="text-gray-500">razorpay_payment_id :-   {invoiceData?.razorpay_payment_id || "Not Available"} </p>
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
