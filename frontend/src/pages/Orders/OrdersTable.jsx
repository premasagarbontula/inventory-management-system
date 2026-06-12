import getFormattedDate from "../../utils/formatDate";

const OrdersTable = ({ orders, onView }) => (
  <table>
    <thead className="text-center">
      <tr>
        <th className="px-5">Order ID</th>
        <th className="px-5">Customer</th>
        <th className="px-15">Date</th>
        <th className="px-5">Items</th>
        <th className="px-5">Actions</th>
      </tr>
    </thead>
    <tbody className="text-center">
      {orders.map((order) => (
        <tr key={order.order_id}>
          <td>{order.order_id}</td>
          <td>{order.customer_name}</td>
          <td>{getFormattedDate(order.order_date)}</td>
          <td>{order.item_count}</td>
          <td>
            <button
              className="cursor-pointer"
              onClick={() => onView(order.order_id)}
            >
              View
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default OrdersTable;
