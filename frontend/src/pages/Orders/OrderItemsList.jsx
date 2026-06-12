const OrderItemsList = ({ orderItems, onRemove, onEdit }) => (
  <ol className="w-100 border justify-center border-blue-700 mt-3">
    {orderItems.map((item, index) => (
      <li className="flex justify-evenly" key={`${item.productId}-${index}`}>
        <span>{item.productName}</span>
        <span>{item.quantity}</span>
        <button onClick={() => onEdit(index)}>Edit</button>
        <button onClick={() => onRemove(index)}>Remove</button>
      </li>
    ))}
  </ol>
);

export default OrderItemsList;
