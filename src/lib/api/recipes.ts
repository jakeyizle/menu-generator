import { Recipe } from "@/types/recipe";
import { FAKE_RECIPES as Recipes } from "./fakeData";

const FAKE_RECIPES = Recipes

export class RecipeNotFoundError extends Error {}

export const getRecipes = async (): Promise<Recipe[]>  => {
    return Promise.resolve(FAKE_RECIPES);
};

export const getRecipe = async (id: string): Promise<Recipe> => {
    const recipe = FAKE_RECIPES.find((recipe) => recipe.id === id)
    if (!recipe) throw new RecipeNotFoundError(`Recipe with id ${id} not found`)
    return Promise.resolve(recipe)
}

export const createRecipe = async (recipe: Recipe): Promise<Recipe> => {
    recipe.id = Date.now().toString()
    FAKE_RECIPES.push(recipe)
    return Promise.resolve(recipe);
}

export const updateRecipe = async (recipe: Recipe): Promise<Recipe> => {
    const index = FAKE_RECIPES.findIndex((r) => r.id === recipe.id)
    if (index === -1) throw new RecipeNotFoundError(`Recipe with id ${recipe.id} not found`)
    FAKE_RECIPES[index] = recipe
    return Promise.resolve(recipe);
}

export const deleteRecipe = async (id: string): Promise<void> => {
    const index = FAKE_RECIPES.findIndex((r) => r.id === id)
    if (index === -1) throw new RecipeNotFoundError(`Recipe with id ${id} not found`)
    FAKE_RECIPES.splice(index, 1)
    return Promise.resolve();
}