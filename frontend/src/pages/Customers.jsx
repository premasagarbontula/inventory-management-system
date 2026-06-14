import { useState } from "react";
import API from "../api/axios";
import CustomerForm from "../components/CustomerForm";
import useCustomers from "../hooks/useCustomers";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";
import { Pencil, Trash2 } from "lucide-react";

const Customers = () => {
  const { customers, fetchCustomers, loading } = useCustomers();
  const [editingCustomer, setEditingCustomer] = useState(null);

  const initialValues = editingCustomer
    ? {
        customerName: editingCustomer.customer_name,
        email: editingCustomer.email,
        phone: editingCustomer.phone,
        address: editingCustomer.address,
      }
    : { customerName: "", email: "", phone: "", address: "" };

  const handleCustomerForm = async (customerFormData) => {
    const { customerName, email, phone, address } = customerFormData;

    if (
      !customerName?.trim() ||
      !email?.trim() ||
      !phone?.trim() ||
      !address?.trim()
    ) {
      toast.error("All fields are required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Enter a valid email");
      return false;
    }
    if (phone.trim().length < 10) {
      toast.error("Enter a valid phone number");
      return false;
    }
    const payload = {
      customer_name: customerName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
    };

    try {
      if (!editingCustomer) {
        const { data } = await API.post("/customers", payload);
        await fetchCustomers();
        toast.success(data.message);
      } else {
        const { data } = await API.put(
          `/customers/${editingCustomer.customer_id}`,
          payload,
        );
        await fetchCustomers();
        toast.success(data.message);
        setEditingCustomer(null);
      }
      return true;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return false;
    }
  };

  const handleDeleteCustomer = async (customer) => {
    if (!window.confirm(`Delete "${customer.customer_name}"?`)) return;
    try {
      const { data } = await API.delete(`/customers/${customer.customer_id}`);
      await fetchCustomers();
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Delete failed");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <section>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Customers</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your customer records
        </p>
      </header>

      <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-sm mb-10">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-100 text-slate-600 uppercase text-xs">
            <tr>
              {[
                "ID",
                "Name",
                "Email",
                "Phone",
                "Address",
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
            {customers.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-slate-400"
                >
                  No customers found
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr
                  key={customer.customer_id}
                  className="bg-white hover:bg-slate-50 transition-colors"
                >
                  <td className="px-4 py-3 text-slate-500">
                    {customer.customer_id}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {customer.customer_name}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{customer.email}</td>
                  <td className="px-4 py-3 text-slate-600">{customer.phone}</td>
                  <td className="px-4 py-3 text-slate-600 max-w-[200px] truncate">
                    {customer.address}
                  </td>
                  <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                    {new Date(customer.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingCustomer(customer)}
                        className="p-1.5 rounded-md text-slate-600 hover:bg-slate-100 transition-colors"
                        title="Edit"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDeleteCustomer(customer)}
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
            {editingCustomer ? "Update Customer" : "Add New Customer"}
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {editingCustomer
              ? `Editing: ${editingCustomer.customer_name}`
              : "Fill in the details below"}
          </p>
        </header>
        <CustomerForm
          key={editingCustomer?.customer_id ?? "new"}
          handleCustomerForm={handleCustomerForm}
          initialValues={initialValues}
          isEditing={!!editingCustomer}
          setEditingCustomer={setEditingCustomer}
        />
      </section>
    </section>
  );
};

export default Customers;
