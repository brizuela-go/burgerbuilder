import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const ingredients = await prisma.ingredient.findMany();
      return res.status(200).json(ingredients);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Something went wrong" });
    }
  }

  if (req.method === "POST") {
    const { name, quantity, icon } = req.body;

    // Check if the ingredient already exists
    const existingIngredient = await prisma.ingredient.findUnique({
      where: { name },
    });

    if (existingIngredient) {
      return res
        .status(400)
        .json({
          message: `Ingredient with name ${icon} ${name} already exists`,
        });
    }

    try {
      const ingredient = await prisma.ingredient.create({
        data: { name, quantity, icon },
      });
      return res.status(201).json(ingredient);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
