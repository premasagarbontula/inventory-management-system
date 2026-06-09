import { useEffect, useState } from "react";

const ProductForm = ({
  handleProductForm,
  initialValues,
  isEdititng,
  setEditingProduct,
}) => {
  const [newProduct, setNewProduct] = useState(initialValues);
  const formInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    function initializeValues() {
      setNewProduct(initialValues);
    }
    initializeValues();
  }, [initialValues]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const success = handleProductForm(newProduct);
    if (success) {
      setNewProduct({
        productName: "",
        sku: "",
        price: "",
        stockQuantity: "",
      });
    }
  };
  return (
    <div>
      <form className="flex flex-col w-75 gap-2" onSubmit={handleFormSubmit}>
        <input
          type="text"
          placeholder="Enter product name"
          name="productName"
          value={newProduct.productName}
          onChange={formInputChange}
          className="border border-amber-500"
        />
        <input
          type="text"
          placeholder="Enter sku"
          name="sku"
          value={newProduct.sku}
          onChange={formInputChange}
          className="border border-amber-500"
        />
        <input
          type="number"
          placeholder="Enter product price"
          name="price"
          value={newProduct.price}
          onChange={formInputChange}
          className="border border-amber-500"
        />
        <input
          type="text"
          placeholder="Enter stock quantity"
          name="stockQuantity"
          value={newProduct.stockQuantity}
          onChange={formInputChange}
          className="border border-amber-500"
        />

        <button type="submit" className="px-1 py-1 mr-2 border rounded-md">
          {isEdititng ? "Update Product" : "Create Product"}
        </button>
        {isEdititng && (
          <button
            type="button"
            className="px-1 py-1 border rounded-md"
            onClick={() => setEditingProduct(null)}
          >
            Cancel update
          </button>
        )}
      </form>
    </div>
  );
};

export default ProductForm;
