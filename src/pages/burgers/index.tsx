import React from "react";
import { IIngredient } from "burger/interfaces/IIngredient";
import HamburgerForm from "burger/components/HamburgerForm";
import Head from "next/head";
import Link from "next/link";
import { NextPage } from "next";

export async function getServerSideProps() {
  const res2 = await fetch(
    "https://burgerbuilder-two.vercel.app/api/ingredients"
  );
  const ingredients = await res2.json();

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
        <title>🍔 Create Burger</title>
        <meta name="description" content="Create your own burger" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="my-20 flex flex-col items-center justify-center  ">
        <h1 className="mb-20 text-center text-5xl font-extrabold tracking-tight text-black sm:text-[4rem]">
          Create Burger
        </h1>

        <HamburgerForm ingredients={ingredients} />

        <Link href="/">
          <button className="mt-16 text-center text-2xl font-extrabold tracking-tight text-black underline ">
            Back to Burgers
          </button>
        </Link>
      </main>
    </>
  );
};

export default Home;
