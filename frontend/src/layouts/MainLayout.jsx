import { NavLink, Outlet } from "react-router-dom";
const getNavLinkClass = ({ isActive }) =>
  `rounded-md px-3 py-2 ${
    isActive ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
  }`;

const MainLayout = () => {
  return (
    <div className="grid min-h-screen grid-cols-[240px_1fr] ">
      <aside className="border-r p-4">
        <nav className="flex flex-col gap-2">
          <NavLink to="/dashboard" className={getNavLinkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/products" className={getNavLinkClass}>
            Products
          </NavLink>
          <NavLink to="/customers" className={getNavLinkClass}>
            Customers
          </NavLink>
          <NavLink to="/orders" className={getNavLinkClass}>
            Orders
          </NavLink>
          <NavLink to="/inventory-history" className={getNavLinkClass}>
            Inventory
          </NavLink>
        </nav>
      </aside>
      <div>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
