import { IIngredient } from "burger/interfaces/IIngredient";
import React from "react";
import { useState, useRef } from "react";
import DeleteModal from "./DeleteModal";
import axios from "axios";
import Router from "next/router";
import toast, { Toaster } from "react-hot-toast";

type Props = {
  ingredients: IIngredient[];
};

const IngredientCard = (props: Props) => {
  const initialOpenStates = Array(props.ingredients.length).fill(true);

  const [openStates, setOpenStates] = useState<boolean[]>([]);
  const [editedIngredients, setEditedIngredients] = useState<{
    [id: string]: number;
  }>({});
  const cancelButtonRef = useRef(null);
  const [editState, setEditState] = useState<boolean>(false);
  const [disableds, setDisableds] = useState<boolean[]>(initialOpenStates);

  const handleDeleteModal =
    (ingredientId: string, index: number) => async () => {
      toast.promise(
        axios.delete(
          `https://burgerbuilder-two.vercel.app/api/ingredients/${ingredientId}`
        ),
        {
          loading: "Deleting...",
          success: (res) => {
            Router.reload();
            return `${res.data.message}`;
          },
          error: (err) => {
            return `${err.response.data.message}`;
          },
        }
      );

      setOpenStates((prevOpenStates) => {
        const newOpenStates = [...prevOpenStates];
        newOpenStates[index] = false;
        return newOpenStates;
      });
    };

  const handleOpenModal = (index: number) => {
    setOpenStates((prevOpenStates) => {
      const newOpenStates = [...prevOpenStates];
      newOpenStates[index] = true;
      return newOpenStates;
    });
  };

  const handleQuantityChange =
    (ingredientId: string, index: number) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(event.target.value);
      setEditedIngredients((prevEditedIngredients) => ({
        ...prevEditedIngredients,
        [ingredientId]: value,
      }));
      // setDisableds previous values to true and then set the current index to false
      setDisableds((prevDisableds) => {
        const newDisableds = [...prevDisableds];
        newDisableds[index] = !value;
        return newDisableds;
      });
    };

  const handleSaveButtonClick = (ingredientId: string) => async () => {
    const quantity = editedIngredients[ingredientId];

    if (quantity) {
      toast.promise(
        axios.put(
          `https://burgerbuilder-two.vercel.app/api/ingredients/${ingredientId}`,
          { quantity }
        ),
        {
          loading: "Saving...",
          success: (res) => {
            Router.reload();
            return `${res.data.icon} ${res.data.name} ingredient updated to ${res.data.quantity}`;
          },
          error: (err) => {
            console.log(err);
            return `${err.response.data.message}`;
          },
        }
      );
    }
  };

  return (
    <>
      <Toaster />
      {props.ingredients.length === 0 && (
        <p className=" mt-12">No ingredients found 😔</p>
      )}
      <div className="container mt-8 flex flex-col items-center justify-center gap-12 px-7 py-2 sm:flex sm:flex-row  ">
        {props.ingredients.map((ingredient, index) => (
          <>
            <DeleteModal
              key={`delete-modal-${ingredient.id}`}
              open={openStates[index] || false}
              setOpen={(newOpenState) => {
                setOpenStates((prevOpenStates) => {
                  const newOpenStates = [...prevOpenStates];
                  newOpenStates[index] = newOpenState;
                  return newOpenStates;
                });
              }}
              cancelButtonRef={cancelButtonRef}
              handleDeleteModal={handleDeleteModal(ingredient.id, index)}
              characteristics={{
                name: `${ingredient.icon} ${ingredient.name} ingredient`,
                action: "delete",
              }}
            />
            <div
              key={`div--${ingredient.id}`}
              className="space-y-2 rounded-lg bg-white px-8 py-3  shadow-lg"
            >
              <h2 className="text-2xl font-bold" key={`h2--${index}`}>
                {ingredient.name}
              </h2>
              <p className="text-2xl" key={`p1--${index}`}>
                {ingredient.icon}
              </p>
              {editState ? (
                <>
                  <input
                    key={`input--${index}`}
                    type="number"
                    value={
                      editedIngredients[ingredient.id] || ingredient.quantity
                    }
                    min="1"
                    max="1000"
                    onChange={handleQuantityChange(ingredient.id, index)}
                  />
                  <div className="flex justify-center gap-x-3">
                    <button
                      onClick={() => {
                        setEditState(!editState);
                      }}
                      className=" rounded-lg bg-slate-700 px-5 py-2 text-center text-sm   text-white  transition duration-100 ease-in-out hover:bg-slate-800 hover:shadow-xl "
                    >
                      Cancel
                    </button>
                    <button
                      key={`button--${index}`}
                      className="rounded-lg bg-green-500 py-2 px-5 text-center text-sm   text-white  transition duration-100 ease-in-out hover:bg-green-700 hover:shadow-xl disabled:cursor-not-allowed disabled:bg-slate-400 disabled:opacity-50"
                      disabled={disableds[index]}
                      onClick={() => {
                        handleSaveButtonClick(ingredient.id)();
                      }}
                    >
                      Save
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p key={`p2--${index}`}>{ingredient.quantity}</p>
                  <div className="flex justify-center gap-x-3">
                    <button
                      onClick={() => {
                        setEditState(!editState);
                      }}
                      className={`rounded-lg bg-blue-700 px-5 py-2 text-center text-sm   text-white  transition duration-100 ease-in-out hover:bg-blue-800 hover:shadow-xl `}
                    >
                      Edit
                    </button>
                    <button
                      key={`button--${index}`}
                      className="rounded-lg bg-red-500 py-2 px-5 text-center text-sm   text-white  transition duration-100 ease-in-out hover:bg-red-700 hover:shadow-xl  "
                      onClick={() => {
                        console.log(ingredient.id);
                        handleOpenModal(index);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </>
        ))}
      </div>
    </>
  );
};

export default IngredientCard;
