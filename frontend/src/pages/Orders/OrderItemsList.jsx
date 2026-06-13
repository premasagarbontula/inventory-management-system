import { Pencil, Trash2 } from "lucide-react";

const OrderItemsList = ({ orderItems, onRemove, onEdit }) => (
  <div className="mt-4 rounded-lg border border-slate-200 overflow-hidden">
    <table className="w-full text-sm text-left">
      <thead className="bg-slate-100 text-slate-600 uppercase text-xs">
        <tr>
          {["Product", "Quantity", "Actions"].map((h) => (
            <th key={h} className="px-4 py-2 font-semibold">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {orderItems.map((item, index) => (
          <tr
            key={`${item.productId}-${index}`}
            className="bg-white hover:bg-slate-50 transition-colors"
          >
            <td className="px-4 py-2 text-slate-800 font-medium">
              {item.productName}
            </td>
            <td className="px-4 py-2 text-slate-600">{item.quantity}</td>
            <td className="px-4 py-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEdit(index)}
                  className="p-1.5 rounded-md text-slate-600 hover:bg-slate-100 transition-colors"
                  title="Edit"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => onRemove(index)}
                  className="p-1.5 rounded-md text-red-500 hover:bg-red-50 transition-colors"
                  title="Remove"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default OrderItemsList;
