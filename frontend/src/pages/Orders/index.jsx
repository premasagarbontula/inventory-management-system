import { useState } from "react";
import API from "../../api/axios";
import useOrders from "../../hooks/useOrders";
import useProducts from "../../hooks/useProducts";
import useCustomers from "../../hooks/useCustomers";
import OrdersTable from "./OrdersTable";
import OrderDetails from "./OrderDetails";
import ItemSelector from "./ItemSelector";
import OrderItemsList from "./OrderItemsList";
import LoadingSpinner from "../../components/LoadingSpinner";
import toast from "react-hot-toast";

const Orders = () => {
  const [item, setItem] = useState({
    productId: "",
    productName: "",
    quantity: "",
  });
  const [editingItemIndex, setEditingItemIndex] = useState(null);
  const [customerId, setCustomerId] = useState("");
  const [orderItems, setOrderItems] = useState([]);
  const [viewedOrder, setViewedOrder] = useState(null);

  const { orders, fetchOrders, loading } = useOrders();
  const { products } = useProducts();
  const { customers } = useCustomers();

  const handleProductSelection = (e) => {
    const selectedProduct = products.find(
      (p) => p.product_id === Number(e.target.value),
    );
    if (!selectedProduct) return;
    setItem((prev) => ({
      ...prev,
      productId: e.target.value,
      productName: selectedProduct.product_name,
    }));
  };

  const handleQuantitySelection = (e) => {
    setItem((prev) => ({ ...prev, quantity: e.target.value }));
  };

  const handleAddItem = () => {
    const qty = Number(item.quantity);

    if (!item.productName) {
      toast.error("Select a product");
      return;
    }
    if (!item.quantity || qty <= 0) {
      toast.error("Quantity must be greater than 0");
      return;
    }
    if (!Number.isInteger(qty)) {
      toast.error("Quantity must be a whole number");
      return;
    }

    const alreadyAdded = orderItems.some((i) => i.productId === item.productId);
    if (alreadyAdded && editingItemIndex === null) {
      toast.error("Product already added");
      return;
    }

    if (editingItemIndex !== null) {
      setOrderItems((prev) =>
        prev.map((o, i) => (i === editingItemIndex ? item : o)),
      );
      setEditingItemIndex(null);
    } else {
      setOrderItems((prev) => [...prev, item]);
    }
    setItem({ productId: "", productName: "", quantity: "" });
  };

  const handleRemoveItem = (index) => {
    setOrderItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEditItem = (index) => {
    setItem(orderItems[index]);
    setEditingItemIndex(index);
  };

  const handleViewOrder = async (orderId) => {
    try {
      const { data } = await API.get(`/orders/${orderId}`);
      setViewedOrder(data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load order");
    }
  };

  const handleCreateOrder = async () => {
    if (!customerId) {
      toast.error("Select a customer");
      return;
    }
    if (orderItems.length === 0) {
      toast.error("Add at least one item");
      return;
    }
    try {
      const { data } = await API.post("/orders", {
        customer_id: customerId,
        items: orderItems.map((i) => ({
          product_id: Number(i.productId),
          quantity: Number(i.quantity),
        })),
      });
      await fetchOrders();
      setOrderItems([]);
      setCustomerId("");
      setItem({ productId: "", productName: "", quantity: "" });
      setEditingItemIndex(null);
      toast.success(data?.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create order");
    }
  };
  if (loading) return <LoadingSpinner />;

  return (
    <section>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Orders</h1>
        <p className="text-sm text-slate-500 mt-1">
          View and manage customer orders
        </p>
      </header>

      {/* Orders Table */}
      <OrdersTable orders={orders} onView={handleViewOrder} />

      {/* Order Details */}
      {viewedOrder && (
        <OrderDetails
          order={viewedOrder}
          onClose={() => setViewedOrder(null)}
        />
      )}

      {/* Create Order */}
      <section className="rounded-lg border border-slate-200 bg-white shadow-sm p-6 mt-8">
        <header className="mb-4">
          <h2 className="text-lg font-semibold text-slate-800">Create Order</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Select a customer and add products
          </p>
        </header>

        <div className="flex flex-col gap-1 mb-4 max-w-xs">
          <label
            htmlFor="customers"
            className="text-xs font-medium text-slate-600"
          >
            Customer
          </label>
          <select
            id="customers"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            className="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            <option value="">Select Customer</option>
            {customers.map((c) => (
              <option value={c.customer_id} key={c.customer_id}>
                {c.customer_name}
              </option>
            ))}
          </select>
        </div>

        <ItemSelector
          item={item}
          products={products}
          onProductChange={handleProductSelection}
          onQuantityChange={handleQuantitySelection}
        />

        <button
          onClick={handleAddItem}
          className="mt-4 px-4 py-2 rounded-md bg-slate-800 text-white text-sm font-semibold hover:bg-slate-700 transition-colors"
        >
          {editingItemIndex !== null ? "Update Item" : "Add Item"}
        </button>

        {orderItems.length > 0 && (
          <OrderItemsList
            orderItems={orderItems}
            onRemove={handleRemoveItem}
            onEdit={handleEditItem}
          />
        )}

        <div className="mt-6 pt-4 border-t border-slate-100">
          <button
            onClick={handleCreateOrder}
            disabled={!customerId || orderItems.length === 0}
            className="px-4 py-2 rounded-md bg-slate-800 text-white text-sm font-semibold hover:bg-slate-700 transition-colors disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
          >
            Create Order
          </button>
        </div>
      </section>
    </section>
  );
};

export default Orders;
