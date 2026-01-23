import React, { useEffect, useState } from "react";
import UserNavBar from "./userNavBar";
import { TrendingUp, Package, CreditCard, Check, ArrowUpRight, ArrowDownLeft, Zap, Shield, Download, AlertCircle } from "lucide-react";

const userDashBoard = () => {
  const [theme, setTheme] = useState(localStorage.getItem("admin-theme") || "light");

  useEffect(() => {
    const handleStorageChange = () => {
      setTheme(localStorage.getItem("admin-theme") || "light");
    };
    window.addEventListener("storage", handleStorageChange);
    const interval = setInterval(handleStorageChange, 500);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const isDark = theme === "dark";

  // 🔹 Enhanced Products Data
  const products = [
    {
      id: 1,
      name: "Pro Subscription",
      price: "₹499 / month",
      description: "Access premium features and advanced analytics",
      badge: "Popular",
      icon: "⭐",
      features: ["Advanced Analytics", "Priority Support", "100GB Storage", "Custom Branding", "API Access", "Team Collaboration"],
      color: "from-emerald-500 to-teal-500"
    },
    {
      id: 2,
      name: "Security Plus",
      price: "₹299 / month",
      description: "Enterprise-grade security and protection",
      badge: "Recommended",
      icon: "🛡️",
      features: ["2FA Authentication", "Device Manager", "Login Alerts", "Biometric Support", "Encryption", "24/7 Monitoring"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: 3,
      name: "Data Export Pack",
      price: "₹199 / month",
      description: "Comprehensive data management solutions",
      badge: null,
      icon: "📊",
      features: ["CSV/JSON Export", "Custom Reports", "Scheduled Export", "Data Backup", "Version Control", "Audit Logs"],
      color: "from-purple-500 to-pink-500"
    },
    {
      id: 4,
      name: "Business Pro",
      price: "₹999 / month",
      description: "Complete business management suite",
      badge: "Enterprise",
      icon: "🚀",
      features: ["Everything in Pro", "Dedicated Account Manager", "Custom Integrations", "Multi-Team Support", "White Label", "SLA Guarantee"],
      color: "from-orange-500 to-red-500"
    },
  ];

  // 🔹 Enhanced Orders Data
  const orders = [
    { id: "#ORD2024001", product: "Pro Subscription", status: "Active", date: "2026-01-20", amount: "₹499", daysLeft: 8 },
    { id: "#ORD2024002", product: "Security Plus", status: "Active", date: "2026-01-18", amount: "₹299", daysLeft: 10 },
    { id: "#ORD2024003", product: "Data Export Pack", status: "Completed", date: "2026-01-15", amount: "₹199", daysLeft: 0 },
    { id: "#ORD2024004", product: "Business Pro", status: "Active", date: "2026-01-22", amount: "₹999", daysLeft: 5 },
    { id: "#ORD2024005", product: "Pro Subscription", status: "Completed", date: "2026-01-10", amount: "₹499", daysLeft: 0 },
    { id: "#ORD2024006", product: "Security Plus", status: "Pending", date: "2026-01-25", amount: "₹299", daysLeft: 15 },
  ];

  // 🔹 Enhanced Transactions Data
  const transactions = [
    { id: "TXN908123", amount: "₹999", method: "UPI", date: "2026-01-25", status: "Success", type: "debit", description: "Business Pro Subscription" },
    { id: "TXN908122", amount: "₹500", method: "Credit Card", date: "2026-01-24", status: "Success", type: "debit", description: "Security Plus Renewal" },
    { id: "TXN908121", amount: "₹199", method: "Wallet", date: "2026-01-23", status: "Success", type: "debit", description: "Data Export Pack" },
    { id: "TXN908120", amount: "₹1,500", method: "Bank Transfer", date: "2026-01-22", status: "Success", type: "credit", description: "Refund Processed" },
    { id: "TXN908119", amount: "₹499", method: "UPI", date: "2026-01-21", status: "Success", type: "debit", description: "Pro Subscription" },
    { id: "TXN908118", amount: "₹299", method: "Debit Card", date: "2026-01-20", status: "Success", type: "debit", description: "Monthly Plan" },
    { id: "TXN908117", amount: "₹199", method: "UPI", date: "2026-01-19", status: "Failed", type: "debit", description: "Payment Declined" },
    { id: "TXN908116", amount: "₹399", method: "Card", date: "2026-01-18", status: "Success", type: "debit", description: "Add-on Purchase" },
  ];

  // 🔹 Enhanced Stats Data
  const stats = [
    { label: "Total Spent", value: "₹8,497", icon: CreditCard, color: "from-emerald-500 to-teal-500", bgColor: isDark ? "bg-emerald-900/20" : "bg-emerald-100/50" },
    { label: "Active Subscriptions", value: "4", icon: Zap, color: "from-blue-500 to-cyan-500", bgColor: isDark ? "bg-blue-900/20" : "bg-blue-100/50" },
    { label: "Total Transactions", value: "28", icon: TrendingUp, color: "from-purple-500 to-pink-500", bgColor: isDark ? "bg-purple-900/20" : "bg-purple-100/50" },
    { label: "Savings This Month", value: "₹2,299", icon: ArrowDownLeft, color: "from-orange-500 to-red-500", bgColor: isDark ? "bg-orange-900/20" : "bg-orange-100/50" },
  ];

  const handlePurchase = (productName) => {
    alert(`Payment flow started for: ${productName}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return isDark ? "bg-emerald-900/40 text-emerald-300" : "bg-emerald-100 text-emerald-700";
      case "Success":
        return isDark ? "bg-green-900/40 text-green-300" : "bg-green-100 text-green-700";
      case "Completed":
        return isDark ? "bg-slate-700 text-slate-300" : "bg-slate-200 text-slate-700";
      case "Pending":
        return isDark ? "bg-yellow-900/40 text-yellow-300" : "bg-yellow-100 text-yellow-700";
      case "Failed":
        return isDark ? "bg-red-900/40 text-red-300" : "bg-red-100 text-red-700";
      default:
        return isDark ? "bg-slate-700 text-slate-300" : "bg-slate-200 text-slate-700";
    }
  };

  return (
    <>
      <UserNavBar />

      <div className={`min-h-screen transition-colors duration-500 ${isDark ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" : "bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100"}`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8 lg:py-10">

          {/* Welcome Section */}
          <div className="mb-8 sm:mb-10">
            <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 transition-colors duration-300 ${isDark ? "text-slate-50" : "text-slate-900"}`}>
              Welcome Back! 👋
            </h1>
            <p className={`text-sm sm:text-base transition-colors duration-300 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Here's your complete account overview and activity summary
            </p>
          </div>

          {/* 🔹 Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className={`rounded-xl p-5 sm:p-6 backdrop-blur-xl border transition-all duration-300 hover:scale-105 hover:shadow-xl group ${
                    isDark
                      ? "bg-slate-800/60 border-slate-700 hover:border-slate-600"
                      : "bg-white/70 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <p className={`text-xs sm:text-sm font-medium mb-2 transition-colors duration-300 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                    {stat.label}
                  </p>
                  <p className={`text-2xl sm:text-3xl font-bold transition-colors duration-300 ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                    {stat.value}
                  </p>
                </div>
              );
            })}
          </div>

          {/* 🔹 Products Section */}
          <div className="mb-8">
            <h2 className={`text-2xl sm:text-3xl font-bold mb-5 transition-colors duration-300 ${isDark ? "text-slate-50" : "text-slate-900"}`}>
              Available Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className={`rounded-xl p-5 sm:p-6 backdrop-blur-xl border transition-all duration-300 hover:scale-105 hover:shadow-2xl group relative overflow-hidden ${
                    isDark
                      ? "bg-slate-800/60 border-slate-700 hover:border-slate-600"
                      : "bg-white/70 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {/* Background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${product.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  
                  <div className="relative z-10">
                    {product.badge && (
                      <div className="mb-3 inline-block">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold transition-colors duration-300 ${
                          isDark
                            ? "bg-gradient-to-r from-red-600 to-rose-600 text-white"
                            : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                        }`}>
                          {product.badge}
                        </span>
                      </div>
                    )}
                    
                    <div className="text-3xl mb-3">{product.icon}</div>
                    
                    <h3 className={`font-bold text-base sm:text-lg mb-2 transition-colors duration-300 ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                      {product.name}
                    </h3>
                    
                    <p className={`text-xs sm:text-sm mb-4 transition-colors duration-300 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                      {product.description}
                    </p>
                    
                    <ul className="mb-5 space-y-2">
                      {product.features.map((feature, i) => (
                        <li key={i} className={`text-xs flex items-start gap-2 transition-colors duration-300 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                          <Check size={14} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <p className={`text-lg sm:text-xl font-bold mb-4 bg-gradient-to-r ${product.color} bg-clip-text text-transparent`}>
                      {product.price}
                    </p>
                    
                    <button
                      onClick={() => handlePurchase(product.name)}
                      className={`w-full py-2.5 sm:py-3 rounded-lg font-semibold text-sm transition-all duration-300 group-hover:shadow-lg bg-gradient-to-r ${product.color} text-white hover:scale-105`}
                    >
                      Purchase Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 🔹 Orders & Transactions Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Orders */}
            <div className={`rounded-xl p-5 sm:p-6 backdrop-blur-xl border transition-colors duration-300 ${
              isDark
                ? "bg-slate-800/60 border-slate-700"
                : "bg-white/70 border-slate-200"
            }`}>
              <h3 className={`text-xl sm:text-2xl font-bold mb-5 flex items-center gap-3 transition-colors duration-300 ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                <Package size={24} className={isDark ? "text-red-400" : "text-emerald-600"} />
                Your Orders
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className={`rounded-lg p-4 backdrop-blur-sm border transition-all duration-300 hover:scale-102 ${
                      isDark
                        ? "bg-slate-700/40 border-slate-600 hover:border-slate-500"
                        : "bg-slate-50/60 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                      <div className="flex-1">
                        <p className={`font-semibold text-sm sm:text-base transition-colors duration-300 ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                          {order.product}
                        </p>
                        <p className={`text-xs transition-colors duration-300 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                          {order.id}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold w-fit transition-colors duration-300 ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
                      <p className={`transition-colors duration-300 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                        {order.date}
                      </p>
                      <div className="flex items-center gap-3">
                        <p className={`font-bold transition-colors duration-300 ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                          {order.amount}
                        </p>
                        {order.daysLeft > 0 && (
                          <p className={`transition-colors duration-300 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                            {order.daysLeft}d
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Transactions */}
            <div className={`rounded-xl p-5 sm:p-6 backdrop-blur-xl border transition-colors duration-300 ${
              isDark
                ? "bg-slate-800/60 border-slate-700"
                : "bg-white/70 border-slate-200"
            }`}>
              <h3 className={`text-xl sm:text-2xl font-bold mb-5 flex items-center gap-3 transition-colors duration-300 ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                <CreditCard size={24} className={isDark ? "text-orange-400" : "text-blue-600"} />
                Recent Transactions
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {transactions.map((txn) => (
                  <div
                    key={txn.id}
                    className={`rounded-lg p-4 backdrop-blur-sm border transition-all duration-300 hover:scale-102 ${
                      isDark
                        ? "bg-slate-700/40 border-slate-600 hover:border-slate-500"
                        : "bg-slate-50/60 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                      <div className="flex-1">
                        <p className={`font-semibold text-sm transition-colors duration-300 ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                          {txn.description}
                        </p>
                        <p className={`text-xs transition-colors duration-300 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                          {txn.id}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold w-fit transition-colors duration-300 ${getStatusColor(txn.status)}`}>
                        {txn.status}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        {txn.type === "debit" ? (
                          <ArrowUpRight size={14} className="text-red-500" />
                        ) : (
                          <ArrowDownLeft size={14} className="text-green-500" />
                        )}
                        <p className={`transition-colors duration-300 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                          {txn.method}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className={`transition-colors duration-300 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                          {txn.date}
                        </p>
                        <p className={`font-bold transition-colors duration-300 ${txn.type === "debit" ? "text-red-500" : "text-green-500"}`}>
                          {txn.type === "debit" ? "-" : "+"}{txn.amount}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default userDashBoard;