import { IIngredient } from "burger/interfaces/IIngredient";
import React from "react";

interface Burger {
  id: string;
  name: string;
  ingredients: IIngredient[];
}

const HamburgerCard = ({
  burgers,
  ingredients,
}: {
  burgers: Burger[];
  ingredients: IIngredient[];
}) => {
  return (
    <>
      <div className="flex flex-col  gap-10  sm:flex-row ">
        {burgers.map((burger) => (
          <div key={burger.id} className="rounded-lg bg-white p-4 shadow-lg">
            <h2 className="text-2xl font-bold">🍔 {burger.name}</h2>
            {burger.ingredients.map((ingredient, i) => (
              <ul className="gap-4 space-y-2 text-center">
                <li key={ingredient.id}>{ingredient.name}</li>
                <li key={i}>
                  {ingredient.icon} - {ingredient.quantity}
                </li>
              </ul>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

export default HamburgerCard;
