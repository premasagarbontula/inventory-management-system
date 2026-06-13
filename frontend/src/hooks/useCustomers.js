import { useEffect, useState } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";

const useCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const fetchCustomers = async () => {
    try {
      const { data } = await API.get("/customers");
      setCustomers(data);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to load customers");
    }
  };

  useEffect(() => {
    function getCustomers() {
      fetchCustomers();
    }
    getCustomers();
  }, []);
  return { customers, fetchCustomers };
};

export default useCustomers;
