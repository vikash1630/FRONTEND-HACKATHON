import React from "react";
import UserNavBar from "./userNavBar";

const userDashBoard = () => {
  // 🔹 Dummy Products
  const products = [
    {
      id: 1,
      name: "Pro Subscription",
      price: "₹499 / month",
      description: "Access premium features and analytics",
    },
    {
      id: 2,
      name: "Security Add-on",
      price: "₹199",
      description: "Extra security and login protection",
    },
    {
      id: 3,
      name: "Data Export Pack",
      price: "₹99",
      description: "Download usage and analytics data",
    },
  ];

  // 🔹 Dummy Orders
  const orders = [
    { id: "#ORD1023", product: "Pro Subscription", status: "Active" },
    { id: "#ORD1018", product: "Security Add-on", status: "Completed" },
  ];

  // 🔹 Dummy Transactions
  const transactions = [
    {
      id: "TXN908123",
      amount: "₹499",
      method: "UPI",
      date: "2026-01-21",
      status: "Success",
    },
    {
      id: "TXN907441",
      amount: "₹199",
      method: "Card",
      date: "2026-01-18",
      status: "Success",
    },
    {
      id: "TXN907102",
      amount: "₹99",
      method: "UPI",
      date: "2026-01-15",
      status: "Failed",
    },
  ];

  const handlePurchase = (productName) => {
    alert(`Payment flow started for: ${productName}`);
  };

  return (
    <>
      <UserNavBar />

      <div className="min-h-screen bg-gray-100 px-4 py-6">
        <div className="max-w-6xl mx-auto space-y-8">

          {/* 🔹 Products */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Available Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white border border-gray-300 rounded-xl p-4 shadow-sm"
                >
                  <h3 className="font-semibold text-black">{product.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {product.description}
                  </p>
                  <p className="text-lg font-medium mt-3">
                    {product.price}
                  </p>
                  <button
                    onClick={() => handlePurchase(product.name)}
                    className="mt-4 w-full py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                  >
                    Buy Now
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 🔹 Orders */}
          <div className="bg-white border border-gray-300 rounded-xl p-4 shadow-sm">
            <h3 className="font-semibold mb-3">Your Orders</h3>
            <div className="space-y-3 text-sm">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between border border-gray-200 rounded-lg p-3"
                >
                  <div>
                    <p className="text-black">{order.product}</p>
                    <p className="text-gray-600">{order.id}</p>
                  </div>
                  <span className="text-black font-medium">
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 🔹 Transactions */}
          <div className="bg-white border border-gray-300 rounded-xl p-4 shadow-sm overflow-x-auto">
            <h3 className="font-semibold mb-3">Transaction History</h3>
            <table className="min-w-full text-sm border border-gray-300">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border px-3 py-2 text-left">Transaction ID</th>
                  <th className="border px-3 py-2 text-left">Amount</th>
                  <th className="border px-3 py-2 text-left">Method</th>
                  <th className="border px-3 py-2 text-left">Date</th>
                  <th className="border px-3 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn, index) => (
                  <tr key={index}>
                    <td className="border px-3 py-2">{txn.id}</td>
                    <td className="border px-3 py-2">{txn.amount}</td>
                    <td className="border px-3 py-2">{txn.method}</td>
                    <td className="border px-3 py-2">{txn.date}</td>
                    <td className="border px-3 py-2">{txn.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </>
  );
};

export default userDashBoard;
