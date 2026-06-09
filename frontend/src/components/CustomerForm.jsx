import { useEffect, useState } from "react";

const CustomerForm = ({
  handleCustomerForm,
  initialValues,
  isEditing,
  setEditingCustomer,
}) => {
  const [customerFormData, setCustomerFormData] = useState(initialValues);
  const formInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setCustomerFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    function initializeValues() {
      setCustomerFormData(initialValues);
    }
    initializeValues();
  }, [initialValues]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const success = await handleCustomerForm(customerFormData);
    if (success) {
      setCustomerFormData({
        customerName: "",
        email: "",
        phone: "",
        address: "",
      });
    }
  };
  return (
    <div>
      <form className="flex flex-col w-75 gap-2" onSubmit={handleFormSubmit}>
        <input
          type="text"
          placeholder="Enter customer name"
          name="customerName"
          value={customerFormData.customerName}
          onChange={formInputChange}
          className="border border-amber-500"
        />
        <input
          type="email"
          placeholder="Enter email"
          name="email"
          value={customerFormData.email}
          onChange={formInputChange}
          className="border border-amber-500"
        />
        <input
          type="tel"
          placeholder="Enter phone number"
          name="phone"
          value={customerFormData.phone}
          onChange={formInputChange}
          className="border border-amber-500"
        />
        <input
          type="text"
          placeholder="Enter address"
          name="address"
          value={customerFormData.address}
          onChange={formInputChange}
          className="border border-amber-500"
        />

        <button type="submit" className="px-1 py-1 mr-2 border rounded-md">
          {isEditing ? "Update customer" : "Create customer"}
        </button>
        {isEditing && (
          <button
            type="button"
            className="px-1 py-1 border rounded-md"
            onClick={() => setEditingCustomer(null)}
          >
            Cancel update
          </button>
        )}
      </form>
    </div>
  );
};

export default CustomerForm;
