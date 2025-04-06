import { Recipe } from "@/types/types";
import localForage from "localforage";
import { v4 as uuidv4 } from 'uuid';

export class RecipeNotFoundError extends Error { }

const db = localForage.createInstance({
    name: "recipes",
    storeName: "recipes",
});

export const getRecipes = async (): Promise<Recipe[]> => {
    const recipes: Recipe[] = []
    await db.iterate((recipe: Recipe) => { 
        recipes.push(recipe) })
    return recipes;
};

export const getRecipe = async (id: string): Promise<Recipe> => {
    const recipe = await db.getItem<Recipe>(id)
    if (!recipe) throw new RecipeNotFoundError(`Recipe with id ${id} not found`)
    return recipe;
};

export const createRecipe = async (recipe: Recipe): Promise<Recipe> => {
    recipe.id ||= uuidv4()
    
    if (await doesRecipeExist(recipe.id)) {
        throw new Error(`Recipe with id ${recipe.id} already exists`)
    }

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

export const doesRecipeExist = async (id: string): Promise<boolean> => {
    const recipe = await db.getItem<Recipe>(id)
    return !!recipe
}