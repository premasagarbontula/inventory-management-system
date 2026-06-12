import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MainLayout from "./layouts/MainLayout";
import Products from "./pages/Products";
import Customers from "./pages/Customers";
import Orders from "./pages/Orders/index.jsx";
import InventoryHistory from "./pages/InventoryHistory";
import ProtectedRoute from "./routes/ProtectedRoute";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },

  {
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/products",
        element: <Products />,
      },
      {
        path: "/customers",
        element: <Customers />,
      },
      {
        path: "/orders",
        element: <Orders />,
      },
      {
        path: "/inventory-history",
        element: <InventoryHistory />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={appRouter} />
      <Toaster position="top-center" />
    </>
  );
}

export default App;
