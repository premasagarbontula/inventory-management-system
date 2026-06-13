import { useState, useEffect, useCallback } from "react";
import useProducts from "./../hooks/useProducts";
import API from "../api/axios";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";

const InventoryHistory = () => {
  const [selectedProductId, setSelectedProductId] = useState("");
  const [transaction, setTransaction] = useState([]);
  const [quantity, setQuantity] = useState("");
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);

  const { products, fetchProducts } = useProducts();

  const selectedProduct = products.find(
    (p) => p.product_id === Number(selectedProductId),
  );

  const getTransactionHistory = useCallback(async () => {
    if (!selectedProductId) return;
    setLoading(true);
    try {
      const { data } = await API.get(`/inventory/history/${selectedProductId}`);
      setTransaction(data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load history");
    } finally {
      setLoading(false);
    }
  }, [selectedProductId]);

  useEffect(() => {
    function loadHistory() {
      getTransactionHistory();
    }
    loadHistory();
  }, [getTransactionHistory]);

  const handleStockInOut = async (type) => {
    const productQuantity = Number(quantity);
    const productRemarks = remarks.trim();

    if (!selectedProductId) {
      toast.error("Select a product");
      return;
    }
    if (productQuantity <= 0) {
      toast.error("Quantity must be greater than 0");
      return;
    }
    if (!Number.isInteger(productQuantity)) {
      toast.error("Quantity must be a whole number");
      return;
    }
    if (!productRemarks) {
      toast.error("Remarks are required");
      return;
    }
    if (type === "out" && productQuantity > selectedProduct?.stock_quantity) {
      toast.error("Insufficient stock");
      return;
    }

    try {
      const { data } = await API.post(`/inventory/${type}`, {
        product_id: selectedProductId,
        quantity: productQuantity,
        remarks: productRemarks,
      });
      await getTransactionHistory();
      await fetchProducts();
      setQuantity("");
      setRemarks("");
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Operation failed");
    }
  };

  const isFormDisabled =
    !selectedProductId || Number(quantity) <= 0 || !remarks.trim();

  return (
    <section>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Inventory</h1>
        <p className="text-sm text-slate-500 mt-1">
          Track stock in and out transactions
        </p>
      </header>

      <div className="flex flex-col gap-1 mb-6 max-w-xs">
        <label htmlFor="product" className="text-xs font-medium text-slate-600">
          Select Product
        </label>
        <select
          id="product"
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
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

      {!selectedProductId ? (
        <p className="text-sm text-slate-400 mb-8">
          Select a product to see its transaction history
        </p>
      ) : loading ? (
        <LoadingSpinner />
      ) : (
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            <div>
              <h2 className="text-base font-semibold text-slate-800">
                {selectedProduct?.product_name}
              </h2>
              <p className="text-sm text-slate-500">
                Current Stock:{" "}
                <span
                  className={`font-semibold ${
                    selectedProduct?.stock_quantity <= 5
                      ? "text-red-500"
                      : "text-green-600"
                  }`}
                >
                  {selectedProduct?.stock_quantity}
                </span>
              </p>
            </div>
          </div>

          {transaction.length === 0 ? (
            <p className="text-sm text-slate-400">
              No transactions found for this product
            </p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-sm">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-100 text-slate-600 uppercase text-xs">
                  <tr>
                    {["Date", "Type", "Qty", "Remarks"].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 font-semibold whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transaction.map((t) => (
                    <tr
                      key={t.transaction_id}
                      className="bg-white hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                        {new Date(t.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            t.transaction_type === "IN"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {t.transaction_type === "IN"
                            ? "Stock In"
                            : "Stock Out"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{t.quantity}</td>
                      <td className="px-4 py-3 text-slate-600">{t.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <section className="rounded-lg border border-slate-200 bg-white shadow-sm p-6 max-w-lg">
        <header className="mb-4">
          <h2 className="text-lg font-semibold text-slate-800">Update Stock</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {selectedProduct
              ? `Updating: ${selectedProduct.product_name}`
              : "Select a product above first"}
          </p>
        </header>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="quantity"
              className="text-xs font-medium text-slate-600"
            >
              Quantity
            </label>
            <input
              id="quantity"
              type="number"
              placeholder="e.g. 10"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="remarks"
              className="text-xs font-medium text-slate-600"
            >
              Remarks
            </label>
            <input
              id="remarks"
              type="text"
              placeholder="e.g. Restocked from supplier"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-slate-100">
          <button
            onClick={() => handleStockInOut("in")}
            type="button"
            disabled={isFormDisabled}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
          >
            <ArrowUpCircle size={16} />
            Stock In
          </button>
          <button
            onClick={() => handleStockInOut("out")}
            type="button"
            disabled={isFormDisabled}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
          >
            <ArrowDownCircle size={16} />
            Stock Out
          </button>
        </div>
      </section>
    </section>
  );
};

export default InventoryHistory;
