import express, { Request, Response } from 'express';
import { scrapeRecipe } from '../utils/scraper.js';
import { Recipe, MealType, Ingredient } from '../../src/types/recipe.js';

const router = express.Router();

/**
 * Validates and normalizes a recipe object to ensure it has all required properties
 * and that they are of the correct type
 */
function validateRecipe(recipe: Partial<Recipe>): Recipe {
  // Ensure recipe has an id
  if (!recipe.id) {
    recipe.id = '';
  }

  // Ensure recipe has a name
  if (!recipe.name || typeof recipe.name !== 'string') {
    recipe.name = 'Untitled Recipe';
  }

  // Ensure recipe has a description
  if (!recipe.description || typeof recipe.description !== 'string') {
    recipe.description = '';
  }

  // Ensure recipe has ingredients array
  if (!recipe.ingredients || !Array.isArray(recipe.ingredients)) {
    recipe.ingredients = [];
  } else {
    // Validate each ingredient
    recipe.ingredients = recipe.ingredients.map(ingredient => validateIngredient(ingredient));
  }

  // Ensure recipe has mealTypes as a Set
  if (!recipe.mealTypes || !(recipe.mealTypes instanceof Set)) {
    // Default to empty set
    recipe.mealTypes = new Set();
  }

return recipe as Recipe;
}

/**
 * Validates and normalizes an ingredient object
 */
function validateIngredient(ingredient: Partial<Ingredient>): Ingredient {
  return {
    name: ingredient.name && typeof ingredient.name === 'string' ? ingredient.name : 'Unknown Ingredient',
    quantity: ingredient.quantity && typeof ingredient.quantity === 'number' ? ingredient.quantity : 1,
    unit: ingredient.unit && typeof ingredient.unit === 'string' ? ingredient.unit : ''
  };
}

// Endpoint to scrape a recipe from a URL
router.post('/scrape', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      res.status(400).json({ error: 'URL is required' });
      return; // Added return to prevent further execution
    }

    const scrapedRecipe = await scrapeRecipe(url);
    // Validate and normalize the recipe before sending it to the client
    const validatedRecipe = validateRecipe(scrapedRecipe);

    // Convert the mealTypes Set to an array for JSON serialization
    const serializedRecipe = {
      ...validatedRecipe,
      mealTypes: Array.from(validatedRecipe.mealTypes)
    };

    res.json(serializedRecipe);
  } catch (error) {
    console.error('Error scraping recipe:', error);
    res.status(500).json({
      error: `Failed to scrape recipe: ${error instanceof Error ? error.message : String(error)}`
    });
  }
});

export default router;
