import { useState } from "react";
import axios from "axios";
import IngredientCheckbox from "../components/IngredientCheckbox";
import { IIngredient } from "../interfaces/IIngredient";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";

export default function HamburgerForm({
  ingredients,
}: {
  ingredients: IIngredient[];
}) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [selectedIngredients, setSelectedIngredients] = useState<IIngredient[]>(
    []
  );

  const Router = useRouter();

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const data = {
      name,
      price,
      ingredients: selectedIngredients,
    };

    toast.promise(
      axios.post("https://burgerbuilder-two.vercel.app/api/burgers", data),
      {
        loading: "Creating 🍔 burger...",
        success: (data) => {
          Router.push("/");
          return "🍔 Burger created!";
        },
        error: (err) => {
          if (err.response.status === 500) {
            return `Either the quantity of the ingredients is not enough, it exceeds the available quantity or you haven't selected more than 2 ingredients. `;
          }
          return `Error: ${err.response.data.error}`;
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <Toaster />
      <div>
        <label htmlFor="name">Name:</label>
        <input
          className="flex justify-center space-x-8"
          required
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="price">Price:</label>
        <input
          className="flex justify-center space-x-8"
          required
          type="number"
          id="price"
          value={price || ""}
          onChange={(e) => setPrice(Number(e.target.value))}
        />
      </div>
      <div className="text-center">
        <p>Select ingredients:</p>
        {ingredients.map((ingredient: IIngredient, index) => (
          <IngredientCheckbox
            key={index}
            index={index}
            ingredient={ingredient}
            onChange={setSelectedIngredients}
          />
        ))}
      </div>
      <div className="text-center">
        <p>Total quantity:</p>
        <p>
          {selectedIngredients.reduce((acc, item) => acc + item.quantity, 0)}
        </p>
      </div>
      <button
        className="via-blue-360 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 p-3 font-bold text-white shadow-md transition duration-75 ease-out hover:from-blue-600 hover:via-purple-700 hover:to-blue-800"
        type="submit"
      >
        Create Burger
      </button>
    </form>
  );
}
