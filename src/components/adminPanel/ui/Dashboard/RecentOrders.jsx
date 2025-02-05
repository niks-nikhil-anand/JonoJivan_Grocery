"use client"
import { motion } from "framer-motion";
import { FaCheckCircle, FaTruck, FaClock } from "react-icons/fa";

const orders = [
  { id: "#ORD-1234", customer: "Rahul Sharma", status: "Delivered", amount: "₹1,200", icon: <FaCheckCircle className="text-green-600" /> },
  { id: "#ORD-1235", customer: "Priya Patel", status: "Processing", amount: "₹2,450", icon: <FaClock className="text-yellow-600" /> },
  { id: "#ORD-1236", customer: "Amit Kumar", status: "Shipped", amount: "₹3,800", icon: <FaTruck className="text-blue-600" /> },
];
const  RecentOrders = () => {
  return (
    <motion.div 
      className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-4 text-gray-600">Order ID</th>
              <th className="py-2 px-4 text-gray-600">Customer</th>
              <th className="py-2 px-4 text-gray-600">Status</th>
              <th className="py-2 px-4 text-gray-600">Amount</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <motion.tr 
                key={index} 
                className="border-b hover:bg-gray-100"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <td className="py-3 px-4">{order.id}</td>
                <td className="py-3 px-4">{order.customer}</td>
                <td className="py-3 px-4 flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-sm font-medium ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : order.status === 'Processing' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>{order.status}</span>
                  {order.icon}
                </td>
                <td className="py-3 px-4">{order.amount}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

export default RecentOrders;
