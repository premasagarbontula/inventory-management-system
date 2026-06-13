import getFormattedDate from "../../utils/formatDate";
import { X } from "lucide-react";

const OrderDetails = ({ order, onClose }) => (
  <>
    <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

    {/* Modal */}
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <article className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <header className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h3 className="font-semibold text-slate-800">
              Order #{order.order_id}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {getFormattedDate(order.order_date)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 transition-colors"
            title="Close"
          >
            <X size={16} />
          </button>
        </header>

        <div className="px-6 py-4">
          <p className="text-sm text-slate-600 mb-4">
            <span className="font-medium text-slate-700">Customer: </span>
            {order.customer_name}
          </p>

          <h4 className="text-xs font-semibold text-slate-600 uppercase mb-2">
            Items
          </h4>
          <ul className="divide-y divide-slate-100">
            {order.items.map((item) => (
              <li
                key={`${item.product_name}-${item.quantity}`}
                className="flex justify-between py-2 text-sm"
              >
                <span className="text-slate-800">{item.product_name}</span>
                <span className="text-slate-500">Qty: {item.quantity}</span>
              </li>
            ))}
          </ul>
        </div>

        <footer className="flex justify-end px-6 py-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-slate-200 text-sm text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
        </footer>
      </article>
    </div>
  </>
);

export default OrderDetails;
