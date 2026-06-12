const ItemSelector = ({
  item,
  products,
  onProductChange,
  onQuantityChange,
}) => (
  <div className="w-100 flex justify-around">
    <div className="flex flex-col">
      <h3>Products</h3>
      <select
        className="border"
        value={item.productId}
        onChange={onProductChange}
      >
        <option value="">Select Product</option>
        {products.map((p) => (
          <option value={p.product_id} key={p.product_id}>
            {p.product_name}
          </option>
        ))}
      </select>
    </div>
    <div className="flex flex-col">
      <h3>Quantity</h3>
      <input
        type="number"
        min="1"
        value={item.quantity}
        placeholder="Enter quantity"
        className="border"
        onChange={onQuantityChange}
      />
    </div>
  </div>
);

export default ItemSelector;
