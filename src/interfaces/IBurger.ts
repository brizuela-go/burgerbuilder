import { IIngredient } from "./IIngredient";

export interface Burger {
  id: string;
  name: string;
  ingredients: IIngredient[];
}
