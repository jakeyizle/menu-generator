import { Recipe } from "@/types/recipe";
import localForage from "localforage";
import { v4 as uuidv4 } from 'uuid';

export class RecipeNotFoundError extends Error { }

const db = localForage.createInstance({
    name: "recipes",
    storeName: "recipes",
});

export const getRecipes = async (): Promise<Recipe[]> => {
    const recipes: Recipe[] = []
    console.log(await db.keys())
    await db.iterate((recipe: Recipe) => { 
        recipes.push(recipe) })
    console.log(recipes)
    return recipes;
};

export const getRecipe = async (id: string): Promise<Recipe> => {
    const recipe = await db.getItem<Recipe>(id)
    if (!recipe) throw new RecipeNotFoundError(`Recipe with id ${id} not found`)
    return recipe;
};

export const createRecipe = async (recipe: Recipe): Promise<Recipe> => {
    recipe.id ||= uuidv4()
    console.log(recipe)
    await db.setItem(recipe.id, recipe)
    return recipe;
};

export const updateRecipe = async (recipe: Recipe): Promise<Recipe> => {
    await db.setItem(recipe.id, recipe)
    return recipe;
};

export const deleteRecipe = async (id: string): Promise<void> => {
    await db.removeItem(id)
};