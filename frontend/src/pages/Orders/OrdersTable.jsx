import getFormattedDate from "../../utils/formatDate";
import { Eye } from "lucide-react";

const OrdersTable = ({ orders, onView }) => (
  <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-sm">
    <table className="w-full text-sm text-left">
      <thead className="bg-slate-100 text-slate-600 uppercase text-xs">
        <tr>
          {["Order ID", "Customer", "Date", "Items", "Actions"].map((h) => (
            <th key={h} className="px-4 py-3 font-semibold whitespace-nowrap">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {orders.length === 0 ? (
          <tr>
            <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
              No orders found
            </td>
          </tr>
        ) : (
          orders.map((order) => (
            <tr
              key={order.order_id}
              className="bg-white hover:bg-slate-50 transition-colors"
            >
              <td className="px-4 py-3 text-slate-500">{order.order_id}</td>
              <td className="px-4 py-3 font-medium text-slate-800">
                {order.customer_name}
              </td>
              <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                {getFormattedDate(order.order_date)}
              </td>
              <td className="px-4 py-3 text-slate-600">{order.item_count}</td>
              <td className="px-4 py-3">
                <button
                  onClick={() => onView(order.order_id)}
                  className="p-1.5 rounded-md text-slate-600 hover:bg-slate-100 transition-colors"
                  title="View"
                >
                  <Eye size={15} />
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default OrdersTable;
