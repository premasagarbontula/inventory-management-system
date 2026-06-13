import { useEffect, useState } from "react";
import API from "../api/axios";
import LoadingSpinner from "../components/LoadingSpinner";
import { Package, Users, ShoppingCart, AlertTriangle } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const statCards = (summary) => [
  {
    label: "Total Products",
    value: summary.totalProducts,
    icon: Package,
  },
  {
    label: "Total Customers",
    value: summary.totalCustomers,
    icon: Users,
  },
  {
    label: "Total Orders",
    value: summary.totalOrders,
    icon: ShoppingCart,
  },
  {
    label: "Low Stock",
    value: summary.lowStockProducts,
    icon: AlertTriangle,
    alert: true,
  },
];

const Dashboard = () => {
  const [summary, setSummary] = useState({
    lowStockProducts: 0,
    totalCustomers: 0,
    totalOrders: 0,
    totalProducts: 0,
  });
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { auth } = useAuth();
  console.log(auth);
  useEffect(() => {
    async function fetchDashboard() {
      try {
        const [summaryRes, lowStockRes] = await Promise.all([
          API.get("/dashboard/summary"),
          API.get("/dashboard/low-stock"),
        ]);
        setSummary(summaryRes.data);
        setLowStockItems(lowStockRes.data);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (loading) return <LoadingSpinner />;

  if (error) return <p className="text-red-500 text-sm">{error}</p>;

  return (
    <section>
      <header className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Business overview</p>
        </div>
        <p className="text-sm text-slate-500">
          Hello,{" "}
          <span className="font-semibold text-slate-800">
            {auth?.user?.username}
          </span>
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards(summary).map(({ label, value, icon: Icon, alert }) => (
          <article
            key={label}
            className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div
              className={`p-2 rounded-md ${alert ? "bg-red-100" : "bg-slate-100"}`}
            >
              <Icon
                size={20}
                className={alert ? "text-red-500" : "text-slate-600"}
              />
            </div>
            <div>
              <p className="text-xs text-slate-500">{label}</p>
              <p
                className={`text-2xl font-bold ${alert && value > 0 ? "text-red-500" : "text-slate-800"}`}
              >
                {value}
              </p>
            </div>
          </article>
        ))}
      </div>
      {lowStockItems.length > 0 && (
        <section className="mt-8">
          <header className="mb-3">
            <h2 className="text-base font-semibold text-slate-800">
              Low Stock Products
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Products with fewer than 10 units remaining
            </p>
          </header>
          <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-100 text-slate-600 uppercase text-xs">
                <tr>
                  {["Product", "SKU", "Stock"].map((h) => (
                    <th key={h} className="px-4 py-3 font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {lowStockItems.map((p) => (
                  <tr key={p.product_id} className="bg-white hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {p.product_name}
                    </td>
                    <td className="px-4 py-3 text-slate-500">{p.sku}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-600">
                        {p.stock_quantity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </section>
  );
};

export default Dashboard;
