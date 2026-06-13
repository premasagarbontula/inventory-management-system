import { useEffect, useState } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";

const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const fetchOrders = async () => {
    try {
      const { data } = await API.get("/orders");
      setOrders(data);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to load orders");
    }
  };

  useEffect(() => {
    function getOrders() {
      fetchOrders();
    }
    getOrders();
  }, []);
  return { orders, fetchOrders };
};

export default useOrders;
