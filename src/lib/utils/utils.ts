import { Burger } from "../types/burgers";

export function parseBurger(burger: any): Burger {
  return {
    ...burger,
    images: burger.images ? JSON.parse(burger.images) : [],
    ingredients: burger.ingredients ? JSON.parse(burger.ingredients) : [],
    tags: burger.tags ? JSON.parse(burger.tags) : [],
  };
}