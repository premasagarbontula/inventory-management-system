import { useEffect, useState } from "react";
import API from "../api/axios";

const useProducts = () => {
  const [products, setProducts] = useState([]);
  const fetchProducts = async () => {
    try {
      const { data } = await API.get("/products");
      setProducts(data);
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message);
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
