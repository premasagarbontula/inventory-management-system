import { useEffect, useState } from "react";
import API from "../api/axios";

const Dashboard = () => {
  const [summary, setSummary] = useState({
    lowStockProducts: 0,
    totalCustomers: 0,
    totalOrders: 0,
    totalProducts: 0,
  });

  useEffect(() => {
    async function fetchDashboardSummary() {
      const { data } = await API.get("/dashboard/summary");
      setSummary(data);
    }
    fetchDashboardSummary();
  }, []);
  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border p-4">
          <h2 className="text-sm text-gray-500">Products</h2>
          <p className="text-3xl font-bold">{summary.totalProducts}</p>
        </div>
        <div className="rounded-lg border p-4">
          <h2 className="text-sm text-gray-500">Customers</h2>
          <p className="text-3xl font-bold">{summary.totalCustomers}</p>
        </div>
        <div className="rounded-lg border p-4">
          <h2 className="text-sm text-gray-500">Orders</h2>
          <p className="text-3xl font-bold">{summary.totalOrders}</p>
        </div>
        <div className="rounded-lg border p-4">
          <h2 className="text-sm text-gray-500">Low Stock</h2>
          <p className="text-3xl font-bold">{summary.lowStockProducts}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
