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
import { Menu, X } from "lucide-react";
import { useState } from "react";

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
  const [menuOpen, setMenuOpen] = useState(false);
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
    <div className="flex flex-col md:grid md:min-h-screen md:grid-cols-[240px_1fr]">
      <aside className="border-b md:border-b-0 md:border-r px-4 py-6 flex md:flex-col justify-between items-center md:items-stretch ">
        <button
          className="md:hidden p-2 rounded-md text-slate-700 hover:bg-slate-100"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <nav
          className={`
          ${menuOpen ? "flex" : "hidden"} md:flex
          flex-col absolute md:static top-14 left-0 right-0
          bg-white md:bg-transparent border-b md:border-none
          p-4 md:p-0 shadow-md md:shadow-none z-50
          gap-2
        `}
        >
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={getNavLinkClass}
              onClick={() => setMenuOpen(false)}
            >
              <Icon size={20} className="shrink-0" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <button
          className="flex items-center gap-3 bg-red-500 text-white font-semibold px-3 py-2 rounded-lg cursor-pointer md:mt-auto"
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
