import { useEffect, useState } from "react";
import API from "../api/axios";

const useCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const fetchCustomers = async () => {
    try {
      const { data } = await API.get("/customers");
      setCustomers(data);
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message);
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
