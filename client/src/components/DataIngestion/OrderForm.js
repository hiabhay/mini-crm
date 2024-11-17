import React, { useState } from "react";
import { createOrder } from "../../services/api";

const OrderForm = () => {
  const [customerId, setCustomerId] = useState("");
  const [amount, setAmount] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!customerId.trim()) {
      newErrors.customerId = "Customer ID is required";
    }

    if (!amount.trim()) {
      newErrors.amount = "Amount is required";
    } else if (isNaN(amount) || parseFloat(amount) <= 0) {
      newErrors.amount = "Amount must be a positive number";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await createOrder({ customerId: customerId, amount: parseFloat(amount) });
      alert("Order created successfully");
      setCustomerId("");
      setAmount("");
      setErrors({});
    } catch (err) {
      alert("Error creating order");
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#E8BCB9] px-4">
      <h1 className="text-4xl font-bold text-[#4B4376] mb-6">Create Order</h1>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-[#432E54] p-6 rounded-lg shadow-lg"
      >
        <div className="mb-4">
          <input
            type="text"
            placeholder="Customer ID"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            required
            className="w-full p-3 text-lg rounded-md bg-[#E8BCB9] text-[#4B4376] placeholder-[#AE445A] focus:outline-none focus:ring-2 focus:ring-[#AE445A]"
          />
          {errors.customerId && (
            <div className="text-sm text-[#AE445A] mt-1">{errors.customerId}</div>
          )}
        </div>

        <div className="mb-4">
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="w-full p-3 text-lg rounded-md bg-[#E8BCB9] text-[#4B4376] placeholder-[#AE445A] focus:outline-none focus:ring-2 focus:ring-[#AE445A]"
          />
          {errors.amount && (
            <div className="text-sm text-[#AE445A] mt-1">{errors.amount}</div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-[#AE445A] text-white py-3 rounded-md font-medium text-lg hover:bg-[#4B4376] transition-colors duration-300"
          disabled={Object.keys(errors).length > 0}
        >
          Create Order
        </button>
      </form>
    </div>
  );
};

export default OrderForm;
