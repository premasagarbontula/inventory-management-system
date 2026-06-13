import { useState } from "react";

const fields = [
  {
    label: "Customer Name",
    name: "customerName",
    type: "text",
    placeholder: "e.g. Rahul Sharma",
  },
  {
    label: "Email",
    name: "email",
    type: "email",
    placeholder: "e.g. rahul@email.com",
  },
  {
    label: "Phone",
    name: "phone",
    type: "tel",
    placeholder: "e.g. 9876543210",
  },
  {
    label: "Address",
    name: "address",
    type: "text",
    placeholder: "e.g. 12 MG Road, Vizag",
  },
];

const empty = { customerName: "", email: "", phone: "", address: "" };

const CustomerForm = ({
  handleCustomerForm,
  initialValues,
  isEditing,
  setEditingCustomer,
}) => {
  const [formData, setFormData] = useState(initialValues);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await handleCustomerForm(formData);
    if (success) setFormData(empty);
  };

  return (
    <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
      {fields.map(({ label, name, type, placeholder }) => (
        <div key={name} className="flex flex-col gap-1">
          <label htmlFor={name} className="text-xs font-medium text-slate-600">
            {label}
          </label>
          <input
            id={name}
            type={type}
            name={name}
            placeholder={placeholder}
            value={formData[name]}
            onChange={handleChange}
            className="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
        </div>
      ))}

      <div className="sm:col-span-2 flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          className="px-4 py-2 rounded-md bg-slate-800 text-white text-sm font-semibold hover:bg-slate-700 transition-colors"
        >
          {isEditing ? "Update Customer" : "Add Customer"}
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={() => setEditingCustomer(null)}
            className="px-4 py-2 rounded-md border border-slate-200 text-sm text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default CustomerForm;
