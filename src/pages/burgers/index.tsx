import React from "react";
import { IIngredient } from "burger/interfaces/IIngredient";
import HamburgerForm from "burger/components/HamburgerForm";
import Head from "next/head";

export async function getStaticProps() {
  const res2 = await fetch("api/ingredients");
  const ingredients = await res2.json();

  return {
    props: {
      ingredients,
    },
  };
}

const Home = ({ ingredients }: { ingredients: IIngredient[] }) => {
  return (
    <>
      <Head>
        <title>🍔 Create Burger</title>
        <meta name="description" content="Create your own burger" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mt-20 flex flex-col items-center justify-center  ">
        <h1 className="mb-20 text-center text-5xl font-extrabold tracking-tight text-black sm:text-[4rem]">
          Create Burger
        </h1>

        <HamburgerForm ingredients={ingredients} />
      </main>
    </>
  );
};

export default Home;
