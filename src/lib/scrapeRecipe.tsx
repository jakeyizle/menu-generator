import { Recipe } from "@/types/recipe";

/**
 * Calls the server-side API to scrape a recipe from a URL
 * 
 * @param url The URL to scrape for recipe data
 * @returns A Promise that resolves to a Recipe object
 * @throws Error if scraping fails or no recipe data is found
 */
export const scrapeRecipe = async (url: string): Promise<Recipe> => {
  try {
    const response = await fetch('/api/recipes/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Server responded with status: ${response.status}`);
    }
    
    const recipe = await response.json();
    return recipe;
  } catch (error) {
    console.error("Error scraping recipe:", error);
    throw new Error(`Failed to scrape recipe: ${error instanceof Error ? error.message : String(error)}`);
  }
};
