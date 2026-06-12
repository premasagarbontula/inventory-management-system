import { useState } from "react";
import API from "../../api/axios";
import useOrders from "../../hooks/useOrders";
import useProducts from "../../hooks/useProducts";
import useCustomers from "../../hooks/useCustomers";
import OrdersTable from "./OrdersTable";
import OrderDetails from "./OrderDetails";
import ItemSelector from "./ItemSelector";
import OrderItemsList from "./OrderItemsList";

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

  const { orders, fetchOrders } = useOrders();
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
    if (item.productName === "" || !item.quantity || item.quantity <= 0)
      return alert("Select both Product and Quantity");

    const alreadyAdded = orderItems.some((i) => i.productId === item.productId);
    if (alreadyAdded && editingItemIndex === null)
      return alert("Product already added");

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
      alert(error?.response?.data?.message);
    }
  };

  const handleCreateOrder = async () => {
    if (!customerId) return alert("Select a customer");
    if (orderItems.length === 0) return alert("Add at least one item");
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
      setItem({
        productId: "",
        productName: "",
        quantity: "",
      });

      setEditingItemIndex(null);
      alert(data?.message);
    } catch (error) {
      alert(error?.response?.data?.message);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Orders</h1>

      <OrdersTable orders={orders} onView={handleViewOrder} />

      {viewedOrder && (
        <OrderDetails
          order={viewedOrder}
          onClose={() => setViewedOrder(null)}
        />
      )}

      <div>
        <h2 className="font-semibold text-xl mt-6 mb-2">Create Order</h2>
        <div className="mb-3">
          <label htmlFor="customers">Customer:</label>
          <select
            id="customers"
            value={customerId}
            className="border"
            onChange={(e) => setCustomerId(e.target.value)}
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

        {orderItems.length > 0 && (
          <OrderItemsList
            orderItems={orderItems}
            onRemove={handleRemoveItem}
            onEdit={handleEditItem}
          />
        )}

        <button
          onClick={handleAddItem}
          className="px-1 py-1 bg-blue-400 text-white rounded-lg mt-5 cursor-pointer"
        >
          {editingItemIndex !== null ? "Update Item" : "Add Item"}
        </button>

        <button
          onClick={handleCreateOrder}
          className="px-1 py-1 ml-2 bg-blue-400 text-white rounded-lg mt-5 cursor-pointer disabled:bg-gray-300 disabled:text-black disabled:cursor-not-allowed"
          disabled={!customerId || orderItems.length === 0}
        >
          Create Order
        </button>
      </div>
    </div>
  );
};

export default Orders;
