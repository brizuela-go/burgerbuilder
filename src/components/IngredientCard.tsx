import { IIngredient } from "burger/interfaces/IIngredient";
import React from "react";
import Router from "next/router";
import { useState, useRef } from "react";
import DeleteModal from "./DeleteModal";

type Props = {
  ingredients: IIngredient[];
};

const IngredientCard = (props: Props) => {
  const handleDelete = (id: string) => async () => {
    const res = await fetch(`/api/ingredients/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    console.log(data);

    Router.reload();
  };

  const [open, setOpen] = useState(false);
  const cancelButtonRef = useRef(null);

  return (
    <>
      {props.ingredients.length === 0 && (
        <p className=" mt-12">No ingredients found 😔</p>
      )}
      <div className="container mt-8 flex flex-col items-center justify-center gap-12 px-7 py-2 sm:flex sm:flex-row  ">
        {props.ingredients.map((ingredient) => (
          <div
            key={ingredient.id}
            className="space-y-2 rounded-lg bg-white px-8 py-3  shadow-lg"
          >
            <DeleteModal
              open={open}
              setOpen={setOpen}
              handleDelete={handleDelete(ingredient.id)}
              cancelButtonRef={cancelButtonRef}
            />
            <h2 className="text-2xl font-bold">{ingredient.name}</h2>
            <p className="text-2xl">{ingredient.icon}</p>
            <p>{ingredient.quantity}</p>
            <button
              className="rounded-lg bg-red-500 p-2 text-white transition duration-100 ease-in-out  hover:bg-red-700 hover:shadow-xl  "
              onClick={() => setOpen(true)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default IngredientCard;
