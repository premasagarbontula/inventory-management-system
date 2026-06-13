import { useEffect, useState } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";

const useProducts = () => {
  const [products, setProducts] = useState([]);
  const fetchProducts = async () => {
    try {
      const { data } = await API.get("/products");
      setProducts(data);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to load products");
    }
  };

  useEffect(() => {
    function getProducts() {
      fetchProducts();
    }
    getProducts();
  }, []);
  return { products, fetchProducts };
};

export default useProducts;
