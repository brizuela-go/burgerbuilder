import { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";

import axios from "axios";
import Link from "next/link";

import HamburgerCard from "../components/HamburgerCard";

export async function getStaticProps() {
  const res = await axios.get(
    "https://burgerbuilder-two.vercel.app/api/burgers"
  );
  const burgers = await res.data;

  const res2 = await axios.get(
    "https://burgerbuilder-two.vercel.app/api/ingredients"
  );
  const ingredients = await res2.data;

  return {
    props: {
      burgers,
      ingredients,
    },
  };
}

const Home: NextPage = ({ burgers, ingredients }: any) => {
  return (
    <>
      <Head>
        <title>🍔 Builder</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mt-12 flex flex-col items-center justify-center  ">
        <Image
          src="/3dburger.webp"
          alt="Hamburgruesa"
          priority={true}
          quality={100}
          width={350}
          height={350}
        />
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-2 ">
          <h1 className="text-center text-5xl font-extrabold tracking-tight text-white sm:text-[4rem]">
            <span className=" bg-gradient-to-br from-purple-400 to-pink-700  bg-clip-text text-transparent ">
              HAMBURGRUESA
            </span>{" "}
            <span className="bg-gradient-to-br from-amber-300 to-amber-700  bg-clip-text text-transparent ">
              BUILDER
            </span>
          </h1>
          <div className="flex justify-between">
            <Link href="/burgers">
              <button className="rounded-md bg-gradient-to-br from-purple-400  to-pink-700 bg-clip-text px-4 py-2 text-2xl font-bold tracking-tight text-transparent hover:bg-amber-300 hover:text-amber-700">
                Create your own burger
              </button>
            </Link>
            <Link href="/ingredients">
              <button className="rounded-md bg-gradient-to-br from-purple-400  to-pink-700 bg-clip-text px-4 py-2 text-2xl font-bold tracking-tight text-transparent hover:bg-amber-300 hover:text-amber-700">
                Manage ingredients
              </button>
            </Link>
          </div>
          <Link
            className="text-center text-2xl font-extrabold tracking-tight  "
            href="#see-burgers"
          >
            <button className=" bg-gradient-to-br from-purple-400 to-pink-700  bg-clip-text text-transparent hover:bg-amber-300 hover:text-amber-700">
              See Burgers <span className="text-black">⬇️</span>
            </button>
          </Link>
          <div id="see-burgers" className=" my-32">
            <HamburgerCard burgers={burgers} ingredients={ingredients} />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
