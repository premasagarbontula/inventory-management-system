import { useState, useEffect, useCallback } from "react";
import useProducts from "./../hooks/useProducts";
import API from "../api/axios";

const InventoryHistory = () => {
  const [selectedProductId, setSelectedProductId] = useState("");
  const [transaction, setTransaction] = useState([]);
  const [quantity, setQuantity] = useState("");
  const [remarks, setRemarks] = useState("");
  const { products, fetchProducts } = useProducts();

  const selectedProduct = products.find(
    (p) => p.product_id === Number(selectedProductId),
  );

  const getTransactionHistory = useCallback(async () => {
    try {
      if (!selectedProductId) return;
      const { data } = await API.get(`/inventory/history/${selectedProductId}`);
      setTransaction(data);
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message);
    }
  }, [selectedProductId]);

  useEffect(() => {
    function loadTransactionHistory() {
      getTransactionHistory();
    }

    loadTransactionHistory();
  }, [getTransactionHistory]);

  const handleStockInOut = async (parameter) => {
    if (
      parameter === "out" &&
      productQuantity > selectedProduct?.stock_quantity
    ) {
      return alert("Insufficient stock");
    }
    const productQuantity = Number(quantity);
    const productRemarks = remarks.trim();
    if (selectedProductId === "") return alert("Provide valid product");
    if (productQuantity <= 0) return alert("Quantity must be greater than 0");
    if (!productRemarks) return alert("Provide remarks");
    try {
      const { data } = await API.post(`/inventory/${parameter}`, {
        product_id: selectedProductId,
        quantity: productQuantity,
        remarks: productRemarks,
      });
      await getTransactionHistory();
      await fetchProducts();
      setQuantity("");
      setRemarks("");
      alert(data.message);
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Inventory Management</h1>
      <div className="flex flex-col items-start mb-1">
        <label htmlFor="product" className="font-semibold text-lg">
          Product:
        </label>
        <select
          id="product"
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
        >
          <option value="">Select Product</option>
          {products.map((p) => (
            <option value={p.product_id} key={p.product_id}>
              {p.product_name}
            </option>
          ))}
        </select>
      </div>

      {selectedProductId !== "" ? (
        transaction.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold">
              Product: {selectedProduct?.product_name}
            </h2>
            <p>Current Stock: {selectedProduct?.stock_quantity}</p>
            <table className="mt-4">
              <thead className="text-center">
                <tr>
                  <th className="px-5">Date</th>
                  <th className="px-3">Type</th>
                  <th className="px-3">Qty</th>
                  <th className="px-3">Remarks</th>
                </tr>
              </thead>

              <tbody className="text-center">
                {transaction.map((t) => (
                  <tr key={t.transaction_id}>
                    <td>{new Date(t.created_at).toLocaleDateString()}</td>
                    <td>{t.transaction_type}</td>
                    <td>{t.quantity}</td>
                    <td>{t.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No transactions found</p>
        )
      ) : (
        <p>Select a PRODUCT to see the transaction history</p>
      )}

      <form className="mt-16">
        <p>Selected Product: {selectedProduct?.product_name || "None"}</p>
        <div className="mt-2 mb-2">
          <label htmlFor="quantity">Quantity</label>
          <input
            id="quantity"
            type="number"
            placeholder="Enter product quantity"
            className="px-4 border ml-2"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>
        <div className="mb-2">
          <label htmlFor="remarks">Remarks</label>
          <input
            id="remarks"
            type="text"
            placeholder="Enter remarks"
            className="px-4 border ml-2"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </div>
        <button
          onClick={() => handleStockInOut("in")}
          type="button"
          className="px-2 py-1 mr-2 rounded-lg bg-green-400 text-white"
          disabled={
            !selectedProductId || Number(quantity) <= 0 || !remarks.trim()
          }
        >
          Stock in
        </button>
        <button
          onClick={() => handleStockInOut("out")}
          type="button"
          className="px-2 py-1 rounded-lg bg-red-400 text-white"
          disabled={
            !selectedProductId || Number(quantity) <= 0 || !remarks.trim()
          }
        >
          Stock out
        </button>
      </form>
    </div>
  );
};

export default InventoryHistory;
