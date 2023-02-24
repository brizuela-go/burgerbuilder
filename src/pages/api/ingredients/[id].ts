import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const ingredient = await prisma.ingredient.findUnique({
        where: { id: String(id) },
      });
      return res.status(200).json(ingredient);
    } catch (error) {
      return res.status(500).json({ message: "Something went wrong" });
    }
  }

  if (req.method === "PUT") {
    const { quantity } = req.body;

    // Check if the ingredient does not exist with id
    const existingIngredient = await prisma.ingredient.findUnique({
      where: { id: String(id) },
    });

    if (!existingIngredient) {
      return res
        .status(400)
        .json({ error: `Ingredient with id ${id} does not exist` });
    }

    try {
      const ingredient = await prisma.ingredient.update({
        where: { id: String(id) },
        data: { quantity },
      });
      return res.status(200).json(ingredient);
    } catch (error) {
      return res.status(500).json({ message: "Something went wrong" });
    }
  }

  if (req.method === "DELETE") {
    // Check if the ingredient exists
    const existingIngredient = await prisma.ingredient.findUnique({
      where: { id: String(id) },
    });

    if (!existingIngredient) {
      return res
        .status(400)
        .json({ error: `Ingredient with id ${id} does not exist` });
    }

    try {
      const ingredient = await prisma.ingredient.delete({
        where: { id: String(id) },
      });
      return res
        .status(200)
        .json({ message: `Ingredient with name "${ingredient.name}" deleted` });
    } catch (error: any) {
      if (error.code === "P2003") {
        return res.status(400).json({
          message: `Ingredient is in use and cannot be deleted. 🍔 Please remove the burger, or the burgers that are using it first.`,
        });
      }
      return res.status(500).json({ message: "Something went wrong" });
    }
  }
  return res.status(405).json({ message: "Method not allowed" });
}
