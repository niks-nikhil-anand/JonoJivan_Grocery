"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AdminPage, AdminPageHeader } from "@/components/adminPanel/AdminPage";
import axios from "axios";

const Page = () => {
  const [data, setData] = useState(null);
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusError, setStatusError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const urlPath = window.location.pathname;
        const id = urlPath.split("/").pop();

        // Fetch order details
        const orderResponse = await axios.get(
          `/api/admin/dashboard/orders/${id}`,
        );
        const order = orderResponse.data;

        // Fetch the cart based on the order's cart ID
        const cartResponse = await axios.get(
          `/api/users/cart/cartId/${order.cart}`,
        );
        const fetchedCart = cartResponse.data.cart.items || [];

        // Fetch product details for each item in the cart
        const productDetails = await Promise.all(
          fetchedCart.map(async (item) => {
            const productResponse = await axios.get(
              `/api/admin/dashboard/product/${item.productId}`,
            );
            return {
              ...productResponse.data,
              salePrice: Number(item.price ?? productResponse.data.salePrice),
              quantity: item.quantity || 1,
            };
          }),
        );

        // Fetch shipping information
        const addressResponse = await axios.get(
          `/api/savedAddress/${order.address}`,
        );
        const shippingInfo = addressResponse.data;

        // Calculate totals
        const subtotal = productDetails.reduce(
          (acc, item) => acc + item.salePrice * item.quantity,
          0,
        );
        const tips = order.tips || 0;
        const shippingCost = order.shippingCost || 0;
        const tax = order.tax || 0;
        const grandTotal = subtotal + tips + shippingCost + tax;

        // Prepare invoice data
        const invoice = {
          paymentStatus: order.paymentStatus,
          orderStatus: order.orderStatus,
          paymentMethod: order.paymentMethod,
          razorpay_order_id: order.razorpay_order_id,
          razorpay_payment_id: order.razorpay_payment_id,
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

  if (loading)
    return (
      <AdminPage>
        <AdminPageHeader title="Order details" />
        <div role="status" className="v-panel p-8">
          <p className="v-muted">Loading order details…</p>
          <div className="mt-5 h-64 animate-pulse rounded-xl v-soft" />
        </div>
      </AdminPage>
    );

  const handleStatusChange = async (type, value) => {
    setSaving(true);
    setStatusMessage("");
    setStatusError("");
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
      setStatusMessage(
        `${type === "paymentStatus" ? "Payment status" : "Order status"} updated successfully.`,
      );
    } catch (error) {
      console.error("Failed to update status", error);

      // Show error toast
      setStatusError("Failed to update status. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (error)
    return (
      <AdminPage>
        <AdminPageHeader title="Order details" />
        <section className="v-panel space-y-4 p-6">
          <p role="alert" className="v-error">
            Unable to load this order. {error}
          </p>
          <button className="v-button" onClick={() => window.location.reload()}>
            Try again
          </button>{" "}
          <Link className="v-button secondary" href="/admin/dashboard/orders">
            Back to orders
          </Link>
        </section>
      </AdminPage>
    );
  const amount = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(Number(value || 0));
  return (
    <AdminPage>
      <AdminPageHeader
        title={`Order ${invoiceData?.invoiceNo || "details"}`}
        description={`Placed ${invoiceData?.orderDate || "—"}`}
        action={
          <Link className="v-button secondary" href="/admin/dashboard/orders">
            Back to orders
          </Link>
        }
      />
      {statusMessage && (
        <p role="status" className="v-success">
          {statusMessage}
        </p>
      )}
      {statusError && (
        <p role="alert" className="v-error">
          {statusError}
        </p>
      )}
      <section className="v-panel p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-lg font-semibold">Order status</h2>
            <p className="mt-1 text-sm v-muted">
              Review payment and delivery progress.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium">
              Payment status
              <select
                disabled={saving}
                className="v-input mt-2"
                value={paymentStatus || invoiceData?.paymentStatus || ""}
                onChange={(e) =>
                  handleStatusChange("paymentStatus", e.target.value)
                }
              >
                <option value="" disabled>
                  Select status
                </option>
                <option value="UnPaid">Unpaid</option>
                <option value="Paid">Paid</option>
              </select>
            </label>
            <label className="text-sm font-medium">
              Order status
              <select
                disabled={saving}
                className="v-input mt-2"
                value={orderStatus || invoiceData?.orderStatus || ""}
                onChange={(e) =>
                  handleStatusChange("orderStatus", e.target.value)
                }
              >
                <option value="" disabled>
                  Select status
                </option>
                {[
                  ["Pending", "Pending"],
                  ["OrderPlaced", "Order placed"],
                  ["Processing", "Processing"],
                  ["PickedUp", "Picked up"],
                  ["OutForDelivery", "Out for delivery"],
                  ["Delivered", "Delivered"],
                  ["Cancelled", "Cancelled"],
                ].map(([value, name]) => (
                  <option key={value} value={value}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </section>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <section className="v-panel p-5">
          <h2 className="font-semibold">Shipping address</h2>
          <div className="mt-3 space-y-1 text-sm leading-6 v-muted">
            <p>{invoiceData?.shippingInfo?.address || "Not available"}</p>
            <p>
              {invoiceData?.shippingInfo?.apartment}{" "}
              {invoiceData?.shippingInfo?.landmark}
            </p>
            <p>
              {invoiceData?.shippingInfo?.city}{" "}
              {invoiceData?.shippingInfo?.state}
            </p>
            <p>{invoiceData?.shippingInfo?.pinCode}</p>
          </div>
        </section>
        <section className="v-panel p-5">
          <h2 className="font-semibold">Customer contact</h2>
          <div className="mt-3 space-y-1 break-words text-sm leading-6 v-muted">
            <p>
              {invoiceData?.shippingInfo?.firstName}{" "}
              {invoiceData?.shippingInfo?.lastName}
            </p>
            <p>{invoiceData?.shippingInfo?.email || "Email unavailable"}</p>
            <p>
              {invoiceData?.shippingInfo?.mobileNumber || "Phone unavailable"}
            </p>
          </div>
        </section>
        <section className="v-panel p-5">
          <h2 className="font-semibold">Payment references</h2>
          <dl className="mt-3 space-y-3 text-sm">
            <div>
              <dt className="v-muted">Razorpay order</dt>
              <dd className="mt-1 break-all font-mono text-xs">
                {invoiceData?.razorpay_order_id || "Not available"}
              </dd>
            </div>
            <div>
              <dt className="v-muted">Razorpay payment</dt>
              <dd className="mt-1 break-all font-mono text-xs">
                {invoiceData?.razorpay_payment_id || "Not available"}
              </dd>
            </div>
          </dl>
        </section>
      </div>
      <section className="v-panel overflow-hidden">
        <h2 className="border-b p-5 font-semibold v-border">Order items</h2>
        <div
          className="overflow-x-auto"
          tabIndex={0}
          role="region"
          aria-label="Order items"
        >
          <table className="v-table min-w-[560px]">
            <thead>
              <tr>
                <th scope="col">Product</th>
                <th scope="col">Unit price</th>
                <th scope="col">Quantity</th>
                <th scope="col">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData?.items?.map((item, index) => (
                <tr key={item._id || index}>
                  <td className="font-medium">{item.name}</td>
                  <td>{amount(item.salePrice)}</td>
                  <td>{item.quantity}</td>
                  <td>{amount(item.salePrice * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <div className="grid gap-5 md:grid-cols-2">
        <section className="v-panel p-5">
          <h2 className="font-semibold">Payment method</h2>
          <p className="mt-3 text-sm v-muted">
            {invoiceData?.paymentMethod || "Not available"}
          </p>
        </section>
        <section className="v-panel p-5">
          <h2 className="font-semibold">Order summary</h2>
          <dl className="mt-4 space-y-3 text-sm">
            {[
              ["Subtotal", invoiceData?.subtotal],
              ["Tips", invoiceData?.tips],
              ["Shipping", invoiceData?.shippingCost],
              ["Tax", invoiceData?.tax],
            ].map(([name, value]) => (
              <div key={name} className="flex justify-between gap-3">
                <dt className="v-muted">{name}</dt>
                <dd>{amount(value)}</dd>
              </div>
            ))}
            <div className="flex justify-between gap-3 border-t pt-4 text-base font-bold v-border">
              <dt>Grand total</dt>
              <dd className="v-green">{amount(invoiceData?.grandTotal)}</dd>
            </div>
          </dl>
        </section>
      </div>
    </AdminPage>
  );
};
export default Page;
