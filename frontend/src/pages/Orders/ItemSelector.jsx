const ItemSelector = ({
  item,
  products,
  onProductChange,
  onQuantityChange,
}) => (
  <div className="grid sm:grid-cols-2 gap-4 max-w-lg">
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-slate-600">Product</label>
      <select
        value={item.productId}
        onChange={onProductChange}
        className="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
      >
        <option value="">Select Product</option>
        {products.map((p) => (
          <option value={p.product_id} key={p.product_id}>
            {p.product_name}
          </option>
        ))}
      </select>
    </div>

    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-slate-600">Quantity</label>
      <input
        type="number"
        min="1"
        value={item.quantity}
        placeholder="e.g. 5"
        onChange={onQuantityChange}
        className="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400"
      />
    </div>
  </div>
);

export default ItemSelector;
