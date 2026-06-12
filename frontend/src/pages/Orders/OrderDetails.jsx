import getFormattedDate from "../../utils/formatDate";

const OrderDetails = ({ order, onClose }) => (
  <div className="w-75 mt-6 border p-3 border-blue-400 rounded-xl">
    <h3 className="mb-2">Order #{order.order_id}</h3>
    <p>Customer: {order.customer_name}</p>
    <p>Date: {getFormattedDate(order.order_date)}</p>
    <div className="mt-3">
      <h4 className="font-semibold">Items</h4>
      <hr />
      <ul className="p-2">
        {order.items.map((item) => (
          <li
            key={`${item.product_name}-${item.quantity}`}
            className="flex justify-between"
          >
            <p>{item.product_name}</p>
            <p>Qty: {item.quantity}</p>
          </li>
        ))}
      </ul>
    </div>
    <div className="text-right">
      <button
        onClick={onClose}
        className="bg-red-400 text-black rounded-md px-4 py-1"
      >
        Close
      </button>
    </div>
  </div>
);

export default OrderDetails;
