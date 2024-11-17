import React, { useState } from "react";
import { createCustomer } from "../../services/api";

const CustomerForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailPattern.test(email)) {
      newErrors.email = "Email is invalid";
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
      await createCustomer({ name, email });
      alert("Customer created successfully!");
      setName("");
      setEmail("");
      setErrors({});
    } catch (err) {
      alert("Error creating customer");
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#E8BCB9] px-4">
      <h1 className="text-4xl font-bold text-[#4B4376] mb-6">Create Customer</h1>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-[#432E54] p-6 rounded-lg shadow-lg"
      >
        <div className="mb-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-3 text-lg rounded-md bg-[#E8BCB9] text-[#4B4376] placeholder-[#AE445A] focus:outline-none focus:ring-2 focus:ring-[#AE445A]"
          />
          {errors.name && (
            <div className="text-sm text-[#AE445A] mt-1">{errors.name}</div>
          )}
        </div>

        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 text-lg rounded-md bg-[#E8BCB9] text-[#4B4376] placeholder-[#AE445A] focus:outline-none focus:ring-2 focus:ring-[#AE445A]"
          />
          {errors.email && (
            <div className="text-sm text-[#AE445A] mt-1">{errors.email}</div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-[#AE445A] text-white py-3 rounded-md font-medium text-lg hover:bg-[#4B4376] transition-colors duration-300"
        >
          Create Customer
        </button>
      </form>
    </div>
  );
};

export default CustomerForm;
