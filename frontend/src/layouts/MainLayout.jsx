import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import API from "../api/axios";
import toast from "react-hot-toast";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  ClipboardList,
  LogOut,
} from "lucide-react";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/products", label: "Products", icon: Package },
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/orders", label: "Orders", icon: ShoppingCart },
  { to: "/inventory-history", label: "Inventory", icon: ClipboardList },
];

const getNavLinkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-md px-3 py-2 ${
    isActive ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
  }`;

const MainLayout = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { data } = await API.post("/users/logout");
      setAuth({ user: null, loading: false });
      toast.success(data.message);
      navigate("/", { replace: true });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Logout failed");
    }
  };

  return (
    <div className="grid min-h-screen md:grid-cols-[240px_1fr]">
      <aside className="border-b md:border-b-0 md:border-r p-4 flex md:flex-col justify-between items-center md:items-stretch w-full md:w-auto">
        <nav className="flex flex-wrap justify-center items-center md:flex-col md:items-stretch gap-2">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={getNavLinkClass}>
              <Icon size={20} className="shrink-0" />
              <span className="hidden md:inline">{label}</span>{" "}
            </NavLink>
          ))}
        </nav>

        <button
          className="flex items-center gap-3 bg-red-500 text-white font-semibold px-3 py-2 rounded-lg cursor-pointer"
          onClick={handleLogout}
        >
          <LogOut size={20} className="shrink-0" />
          <span className="hidden md:inline">Logout</span>
        </button>
      </aside>

      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
