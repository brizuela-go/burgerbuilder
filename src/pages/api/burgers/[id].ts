import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // get burger from id
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const burger = await prisma.burger.findUnique({
        where: { id: String(id) },
        include: {
          ingredients: true,
        },
      });
      return res.status(200).json(burger);
    } catch (error) {
      return res.status(500).json({ message: "Something went wrong" });
    }
  }

  if (req.method === "DELETE") {
    // Check if the burger exists
    const existingBurger = await prisma.burger.findUnique({
      where: { id: String(id) },
      include: { ingredients: true },
    });

    if (!existingBurger) {
      return res
        .status(400)
        .json({ error: `Burger with id ${id} does not exist` });
    }

    try {
      // Delete the relationship between the burger and the ingredients in the BurgerIngredients table
      await prisma.burgerIngredient.deleteMany({
        where: { burgerId: String(id) },
      });

      // Delete the burger
      const deletedBurger = await prisma.burger.delete({
        where: { id: String(id) },
      });

      return res
        .status(200)
        .json({ message: `😋 Yum. "${deletedBurger.name}" burger eaten` });
    } catch (error) {
      return res.status(500).json({ message: "Something went wrong" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
