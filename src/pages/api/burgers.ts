import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const burgers = await prisma.burger.findMany({
        include: {
          ingredients: true,
        },
      });
      return res.status(200).json(burgers);
    } catch (error) {
      return res.status(500).json({ message: "Something went wrong" });
    }
  }

  if (req.method === "POST") {
    const { name, price, ingredients } = req.body;

    // Check if the burger name is already taken
    const burgerExists = await prisma.burger.findUnique({
      where: { name } as any,
    });

    if (burgerExists) {
      return res
        .status(400)
        .json({ error: `Burger name of ${name} already taken` });
    }

    try {
      // Get the ids of the ingredients
      const ingredientQuantities = await Promise.all(
        ingredients.map(
          async (ingredient: {
            name: string;
            quantity: number;
            icon: string;
          }) => {
            const { name, quantity, icon } = ingredient;
            const ingredientDb = await prisma.ingredient.findUnique({
              where: { name },
            });

            // Check if the ingredient exists
            if (!ingredientDb) {
              return res.status(400).json({
                error: `Ingredient with name ${name} does not exist`,
              });
            }

            // Check if there are enough units of the ingredient
            if (ingredientDb.quantity < quantity) {
              return res
                .status(400)
                .json({ error: `Not enough ${name} available` });
            }

            // Update the quantity of the ingredient
            await prisma.ingredient.update({
              where: { name },
              data: { quantity: ingredientDb.quantity - quantity },
            });

            return {
              ingredientId: ingredientDb.id,
              quantity,
              icon,
            };
          }
        )
      );

      // Create the burger
      const newBurger = await prisma.burger.create({
        data: {
          name,
          price,
          ingredients: {
            createMany: {
              data: ingredientQuantities,
            },
          },
        },
        include: {
          ingredients: true,
        },
      });

      return res.status(201).json(newBurger);
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
