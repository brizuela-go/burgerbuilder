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
                .json({ error: `Not enough ${icon} ${name} available` });
            }

            // Check if the quantity is less than 1
            if (quantity < 1) {
              return res.status(400).json({
                error: `Quantity of ${icon} ${name} must be at least 1`,
              });
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

      // Check if the user did not enter any ingredients
      if (ingredientQuantities.length < 2) {
        return res
          .status(400)
          .json({ error: "You must select at least 2 ingredients" });
      }

      // Check if there are any erros with the ingredients
      if (ingredientQuantities.some((ingredient) => ingredient.error)) {
        return res
          .status(400)
          .json({
            error: ingredientQuantities.map((ingredient) => ingredient.error),
          });
      } else {
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
      }
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
