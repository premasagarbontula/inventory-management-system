import { useState } from "react";
import API from "../api/axios";
import ProductForm from "../components/ProductForm";
import useProducts from "../hooks/useProducts";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";
import { Pencil, Trash2 } from "lucide-react";

const Products = () => {
  const { products, fetchProducts, loading } = useProducts();
  const [editingProduct, setEditingProduct] = useState(null);

  const initialValues = editingProduct
    ? {
        productName: editingProduct.product_name,
        sku: editingProduct.sku,
        price: editingProduct.price,
        stockQuantity: editingProduct.stock_quantity,
      }
    : { productName: "", sku: "", price: "", stockQuantity: "" };

  const handleProductForm = async (productFormData) => {
    const { productName, sku, price, stockQuantity } = productFormData;

    if (
      !productName?.trim() ||
      !sku?.trim() ||
      price === "" ||
      stockQuantity === ""
    ) {
      toast.error("All fields are required");
      return false;
    }
    if (Number(price) <= 0) {
      toast.error("Price must be greater than 0");
      return false;
    }
    if (Number(stockQuantity) < 0) {
      toast.error("Stock quantity cannot be negative");
      return false;
    }
    if (!Number.isInteger(Number(stockQuantity))) {
      toast.error("Stock quantity must be a whole number");
      return false;
    }

    const payload = {
      product_name: productName.trim(),
      sku: sku.trim(),
      price,
      stock_quantity: stockQuantity,
    };

    try {
      if (!editingProduct) {
        const { data } = await API.post("/products", payload);
        await fetchProducts();
        toast.success(data.message);
      } else {
        const { data } = await API.put(
          `/products/${editingProduct.product_id}`,
          payload,
        );
        await fetchProducts();
        toast.success(data.message);
        setEditingProduct(null);
      }
      return true;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return false;
    }
  };

  const handleDeleteProduct = async (product) => {
    if (!window.confirm(`Delete "${product.product_name}"?`)) return;
    try {
      const { data } = await API.delete(`/products/${product.product_id}`);
      await fetchProducts();
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Delete failed");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <section>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Products</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your product catalog
        </p>
      </header>

      <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-sm mb-10">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-100 text-slate-600 uppercase text-xs">
            <tr>
              {[
                "ID",
                "Name",
                "SKU",
                "Price",
                "Stock",
                "Created",
                "Actions",
              ].map((h) => (
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
            {products.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-slate-400"
                >
                  No products found
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr
                  key={product.product_id}
                  className="bg-white hover:bg-slate-50 transition-colors"
                >
                  <td className="px-4 py-3 text-slate-500">
                    {product.product_id}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {product.product_name}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{product.sku}</td>
                  <td className="px-4 py-3 text-slate-600">₹{product.price}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        product.stock_quantity <= 10
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {product.stock_quantity}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                    {new Date(product.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="p-1.5 rounded-md text-slate-600 hover:bg-slate-100 transition-colors"
                        title="Edit"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product)}
                        className="p-1.5 rounded-md text-red-500 hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white shadow-sm p-6">
        <header className="mb-4">
          <h2 className="text-lg font-semibold text-slate-800">
            {editingProduct ? "Update Product" : "Add New Product"}
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {editingProduct
              ? `Editing: ${editingProduct.product_name}`
              : "Fill in the details below"}
          </p>
        </header>
        <ProductForm
          key={editingProduct?.product_id ?? "new"}
          handleProductForm={handleProductForm}
          initialValues={initialValues}
          isEditing={!!editingProduct}
          setEditingProduct={setEditingProduct}
        />
      </section>
    </section>
  );
};

export default Products;
