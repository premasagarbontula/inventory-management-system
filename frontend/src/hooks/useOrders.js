import { useEffect, useState } from "react";
import API from "../api/axios";

const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const fetchOrders = async () => {
    try {
      const { data } = await API.get("/orders");
      setOrders(data);
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message);
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
