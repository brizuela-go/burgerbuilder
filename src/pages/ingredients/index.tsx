import IngredientCard from "burger/components/IngredientCard";
import IngredientForm from "burger/components/IngredientForm";
import { IIngredient } from "burger/interfaces/IIngredient";
import Link from "next/link";
import React from "react";
import Head from "next/head";
import { NextPage } from "next";

export async function getServerSideProps() {
  const res = await fetch(
    "https://burgerbuilder-two.vercel.app/api/ingredients"
  );
  const ingredients = await res.json();

  return {
    props: {
      ingredients,
    },
  };
}

type Props = {
  ingredients: IIngredient[];
};

const Home: NextPage<Props> = ({ ingredients }) => {
  return (
    <>
      <Head>
        <title>Manage Ingredients {} </title>
        <meta name="description" content="Manage Ingredients" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mt-32 block items-center justify-center text-center">
        <h1 className="mb-20 text-center text-5xl font-extrabold tracking-tight text-black sm:text-[4rem]">
          Manage Ingredients
        </h1>
        <IngredientForm />
        <div className="my-10 gap-10 space-y-5">
          <h3>
            <span className="text-3xl font-extrabold tracking-tight text-black ">
              Available Ingredients
            </span>
            <IngredientCard ingredients={ingredients} />
          </h3>
        </div>
        <Link href="/">
          <button className="my-20 text-center text-2xl font-extrabold tracking-tight text-black underline ">
            Back to Burgers
          </button>
        </Link>
      </main>
    </>
  );
};

export default Home;
