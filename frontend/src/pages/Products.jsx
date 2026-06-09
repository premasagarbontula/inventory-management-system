import { useEffect, useState } from "react";
import API from "../api/axios";
import ProductForm from "../components/ProductForm";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const initialValues = editingProduct
    ? {
        productName: editingProduct?.product_name,
        sku: editingProduct?.sku,
        price: editingProduct?.price,
        stockQuantity: editingProduct?.stock_quantity,
      }
    : {
        productName: "",
        sku: "",
        price: "",
        stockQuantity: "",
      };
  async function fetchProducts() {
    try {
      const { data } = await API.get("/products");
      setProducts(data);
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message);
    }
  }
  useEffect(() => {
    const loadProducts = async () => {
      await fetchProducts();
    };

    loadProducts();
  }, []);

  const handleProductForm = async (productFormData) => {
    try {
      const { productName, sku, price, stockQuantity } = productFormData;
      if (
        !productName?.trim() ||
        !sku?.trim() ||
        price === "" ||
        stockQuantity === ""
      )
        return alert("All fields required to create new product");
      const newProduct = {
        product_name: productName.trim(),
        sku: sku.trim(),
        price: price,
        stock_quantity: stockQuantity,
      };
      if (!editingProduct) {
        const res = await API.post("/products", newProduct);
        await fetchProducts();

        alert(res?.data?.message);
      } else {
        const res = await API.put(
          `/products/${editingProduct.product_id}`,
          newProduct,
        );
        await fetchProducts();
        alert(res?.data?.message);
        setEditingProduct(null);
      }
      return true;
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message);
      return false;
    }
  };

  const handleDeleteProduct = async (product) => {
    try {
      if (!window.confirm("Do you want to delete the product?")) {
        return;
      }
      const { data } = await API.delete(`/products/${product.product_id}`);
      await fetchProducts();
      alert(data?.message);
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message);
    }
  };
  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Products</h1>
      <table className="text-center">
        <thead>
          <tr className="">
            <th>product_id</th>
            <th>product_name</th>
            <th>sku</th>
            <th>price</th>
            <th>stock_quantity</th>
            <th>created_at</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.product_id}>
              <td>{product.product_id}</td>
              <td>{product.product_name}</td>
              <td>{product.sku}</td>
              <td>{product.price}</td>
              <td>{product.stock_quantity}</td>
              <td>{new Date(product.created_at).toLocaleDateString()}</td>
              <td>
                <button onClick={() => setEditingProduct(product)}>Edit</button>

                <button onClick={() => handleDeleteProduct(product)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <h3 className="mb-4 text-3xl font-bold">
          {editingProduct ? "Update product" : "Create product"}
        </h3>
        <ProductForm
          handleProductForm={handleProductForm}
          initialValues={initialValues}
          isEditing={!!editingProduct}
          setEditingProduct={setEditingProduct}
        />
      </div>
    </div>
  );
};

export default Products;
