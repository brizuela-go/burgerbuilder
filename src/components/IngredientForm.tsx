import React from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const IngredientForm = () => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [icon, setIcon] = useState("");

  const Router = useRouter();

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const data = {
      name,
      quantity,
      icon,
    };
    const res = await axios.post(
      "https://burgerbuilder-two.vercel.app/api/ingredients",
      data
    );

    toast.promise(res.data, {
      loading: `Ingredient with ${icon} ${name} is being added...`,
      success: `Ingredient with ${icon} ${name} added successfully!`,
      error: `Error adding ingredient with ${icon} ${name}! Error: ${res.data.message}}`,
    });

    setName("");
    setIcon("");
  };

  return (
    <>
      <Toaster />
      <div className="flex items-center justify-center">
        <form
          className="flex flex-col items-center justify-center gap-7 rounded-lg bg-white p-5 shadow-xl"
          onSubmit={handleSubmit}
        >
          <div className="flex justify-center space-x-8">
            <label htmlFor="name">Name:</label>
            <input
              required
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex justify-center space-x-4">
            <label htmlFor="quantity">Quantity:</label>
            <input
              required
              type="number"
              id="quantity"
              value={quantity || ""}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>
          <div className="flex justify-center  space-x-11">
            <label htmlFor="icon">Icon:</label>
            <input
              required
              type="text"
              id="icon"
              maxLength={2}
              minLength={2}
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
            />
          </div>

          <button
            className="via-blue-360 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 p-3 font-bold text-white shadow-md transition duration-75 ease-out hover:from-blue-600 hover:via-purple-700 hover:to-blue-800"
            type="submit"
          >
            Add Ingredient
          </button>
        </form>
      </div>
    </>
  );
};

export default IngredientForm;
