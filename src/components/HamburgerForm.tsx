import { useState } from "react";
import axios from "axios";
import IngredientCheckbox from "../components/IngredientCheckbox";
import { IIngredient } from "../interfaces/IIngredient";
import { useRouter } from "next/router";

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
    const res = await axios.post("/api/burgers", data);
    console.log(res.data);

    Router.push("/");
  };

  return (
    <form onSubmit={handleSubmit}>
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
        {ingredients.map((ingredient: IIngredient) => (
          <IngredientCheckbox
            key={ingredient.id}
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
