import { IIngredient } from "./IIngredient";

export interface IBurger {
  id: string;
  name: string;
  ingredients: IIngredient[];
}
