import React from "react";
import { useState, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import Router from "next/router";

import DeleteModal from "./DeleteModal";

import { IBurger } from "burger/interfaces/IBurger";

type Props = {
  burgers: IBurger[];
};

const HamburgerCard = ({ burgers }: Props) => {
  const [openStates, setOpenStates] = useState<boolean[]>([]);
  const cancelButtonRef = useRef(null);

  const handleDeleteModal = (burgerId: string, index: number) => async () => {
    toast.promise(
      axios.delete(
        `https://burgerbuilder-two.vercel.app/api/burgers/${burgerId}`
      ),
      {
        loading: "Eating Burger...",
        success: (res) => {
          Router.reload();
          return `${res.data.message}`;
        },
        error: (err) => {
          console.log(err);
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

  return (
    <>
      <Toaster />
      {burgers.length === 0 && <p className=" mt-12">Out of burgers 😔</p>}
      <div className="flex flex-col  gap-10  sm:flex-row ">
        {burgers.map((burger, index) => (
          <div key={burger.id} className="rounded-lg bg-white p-4 shadow-lg">
            <DeleteModal
              key={`delete-modal-${burger.id}`}
              open={openStates[index] || false}
              setOpen={(newOpenState) => {
                setOpenStates((prevOpenStates) => {
                  const newOpenStates = [...prevOpenStates];
                  newOpenStates[index] = newOpenState;
                  return newOpenStates;
                });
              }}
              cancelButtonRef={cancelButtonRef}
              handleDeleteModal={handleDeleteModal(burger.id, index)}
              characteristics={{
                name: `🍔 ${burger.name} burger`,
                action: "eat",
              }}
            />
            <h2 className="text-2xl font-bold">🍔 {burger.name}</h2>
            {burger.ingredients.map((ingredient, i) => (
              <ul
                className="gap-4 space-y-2 text-center"
                key={`ul-${ingredient.id}`}
              >
                <li key={ingredient.id}>{ingredient.name}</li>
                <li key={i}>
                  {ingredient.icon} - {ingredient.quantity}
                </li>
              </ul>
            ))}
            <button
              key={`button--${index}`}
              className="rounded-lg bg-red-500 p-2 text-white transition duration-100 ease-in-out  hover:bg-red-700 hover:shadow-xl  "
              onClick={() => {
                console.log(burger.id);
                handleOpenModal(index);
              }}
            >
              Eat
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default HamburgerCard;
