import { useState } from "react";
import API from "../api/axios";
import CustomerForm from "../components/CustomerForm";
import useCustomers from "../hooks/useCustomers";

const Customers = () => {
  const { customers, fetchCustomers } = useCustomers();
  const [editingCustomer, setEditingCustomer] = useState(null);
  const initialValues = editingCustomer
    ? {
        customerName: editingCustomer?.customer_name,
        email: editingCustomer?.email,
        phone: editingCustomer?.phone,
        address: editingCustomer?.address,
      }
    : {
        customerName: "",
        email: "",
        phone: "",
        address: "",
      };

  const handleCustomerForm = async (customerFormData) => {
    try {
      const { customerName, email, phone, address } = customerFormData;
      if (
        !customerName?.trim() ||
        !email?.trim() ||
        !phone.trim() ||
        !address.trim()
      )
        return alert("All fields required to create new customer");
      const newCustomer = {
        customer_name: customerName.trim(),
        email: email.trim(),
        phone: phone,
        address: address.trim(),
      };
      if (!editingCustomer) {
        const res = await API.post("/customers", newCustomer);
        await fetchCustomers();

        alert(res?.data?.message);
      } else {
        const res = await API.put(
          `/customers/${editingCustomer.customer_id}`,
          newCustomer,
        );
        await fetchCustomers();
        alert(res?.data?.message);
        setEditingCustomer(null);
      }
      return true;
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message);
      return false;
    }
  };

  const handleDeleteCustomer = async (customer) => {
    try {
      if (!window.confirm("Do you want to delete the customer?")) {
        return;
      }
      const { data } = await API.delete(`/customers/${customer.customer_id}`);
      await fetchCustomers();
      alert(data?.message);
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message);
    }
  };
  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Customers</h1>
      <table className="text-center">
        <thead>
          <tr className="">
            <th>customer_id</th>
            <th>customer_name</th>
            <th>email</th>
            <th>phone</th>
            <th>address</th>
            <th>created_at</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.customer_id}>
              <td>{customer.customer_id}</td>
              <td>{customer.customer_name}</td>
              <td>{customer.email}</td>
              <td>{customer.phone}</td>
              <td>{customer.address}</td>
              <td>{new Date(customer.created_at).toLocaleDateString()}</td>
              <td>
                <button onClick={() => setEditingCustomer(customer)}>
                  Edit
                </button>

                <button onClick={() => handleDeleteCustomer(customer)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <h3 className="mb-4 text-3xl font-bold">
          {editingCustomer ? "Update customer" : "Create customer"}
        </h3>
        <CustomerForm
          handleCustomerForm={handleCustomerForm}
          initialValues={initialValues}
          isEditing={!!editingCustomer}
          setEditingCustomer={setEditingCustomer}
        />
      </div>
    </div>
  );
};

export default Customers;
