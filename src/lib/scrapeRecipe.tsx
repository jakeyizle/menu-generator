import { Recipe, Ingredient, MealType } from "@/types/recipe";

/**
 * Cleans up text by decoding entities and removing HTML tags
 * 
 * @param text The text to clean up
 * @returns Cleaned plaintext
 */
function cleanupText(text: string): string {
  if (!text) return '';
  
  // Step 1: Create a temporary element to decode HTML entities
  const doc = new DOMParser().parseFromString(text, 'text/html');
  let decoded = doc.body.textContent || '';
  
  // Step 2: Handle any URL encoding
  try {
    // Only attempt to decode if it looks like it might be URL encoded
    if (decoded.includes('%')) {
      const potentiallyDecoded = decodeURIComponent(decoded);
      decoded = potentiallyDecoded;
    }
  } catch (e) {
    // If decoding fails, keep the original text
    console.warn('Error decoding URL-encoded text:', e);
  }
  
  // Step 3: Clean up whitespace
  decoded = decoded.replace(/\s+/g, ' ').trim();
  
  return decoded;
}

/**
 * List of public CORS proxies that can be used
 * If one fails, the code will try the next one
 */
const CORS_PROXIES = [
  'https://corsproxy.io/?',
  'https://api.allorigins.win/raw?url=',
  'https://api.codetabs.com/v1/proxy?quest=',
  'https://cors-anywhere.herokuapp.com/'
];

/**
 * Attempts to scrape a URL for recipe data using structured data formats
 * Looks for JSON-LD and microdata formats commonly used for recipes
 * 
 * @param url The URL to scrape for recipe data
 * @returns A Promise that resolves to a Recipe object
 * @throws Error if scraping fails or no recipe data is found
 */

export const scrapeRecipe = async (url: string): Promise<Recipe> => {
  try {
    let html = '';
    let proxySuccess = false;
    let lastError: Error | null = null;
    
    // Try each proxy until one works
    for (const proxy of CORS_PROXIES) {
      try {
        const encodedUrl = proxy.includes('?url=') ? encodeURIComponent(url) : url;
        const proxyUrl = `${proxy}${encodedUrl}`;
        
        console.log(`Trying proxy: ${proxy}`);
        const response = await fetch(proxyUrl, {
          headers: {
            'Origin': window.location.origin
          }
        });
        
        if (response.ok) {
          html = await response.text();
          proxySuccess = true;
          console.log(`Successfully fetched with proxy: ${proxy}`);
          break;
        }
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.warn(`Proxy ${proxy} failed:`, error);
        // Continue to the next proxy
      }
    }
    
    // If all proxies failed, try JSONP approach as a last resort
    if (!proxySuccess) {
      try {
        console.log("All proxies failed, attempting JSONP approach");
        // Create a unique callback name
        const callbackName = `jsonpCallback_${Date.now()}`;
        
        // Create a promise that will be resolved by the JSONP callback
        const jsonpPromise = new Promise<string>((resolve, reject) => {
          // Set timeout to prevent hanging
          const timeoutId = setTimeout(() => {
            delete (window as any)[callbackName];
            document.body.removeChild(script);
            reject(new Error("JSONP request timed out"));
          }, 10000);
          
          // Define the callback function
          (window as any)[callbackName] = (data: any) => {
            clearTimeout(timeoutId);
            delete (window as any)[callbackName];
            document.body.removeChild(script);
            
            if (data && data.contents) {
              resolve(data.contents);
            } else {
              reject(new Error("Invalid JSONP response"));
            }
          };
          
          // Create and append the script element
          const script = document.createElement('script');
          script.src = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}&callback=${callbackName}`;
          script.onerror = () => {
            clearTimeout(timeoutId);
            delete (window as any)[callbackName];
            document.body.removeChild(script);
            reject(new Error("JSONP request failed"));
          };
          document.body.appendChild(script);
        });
        
        // Wait for the JSONP response
        html = await jsonpPromise;
        proxySuccess = true;
        console.log("Successfully fetched with JSONP approach");
      } catch (jsonpError) {
        console.warn("JSONP approach failed:", jsonpError);
        // If JSONP also fails, throw the original error
        throw lastError || new Error("All methods failed to fetch the URL");
      }
    }
    
    // Try to extract JSON-LD structured data (preferred method)
    const jsonLdRecipe = extractJsonLdRecipe(html);
    if (jsonLdRecipe) {
      return jsonLdRecipe;
    }
    
    // Fall back to microdata if JSON-LD is not available
    const microdataRecipe = extractMicrodataRecipe(html);
    if (microdataRecipe) {
      return microdataRecipe;
    }
    
    // No structured recipe data found
    throw new Error("No recipe data found on the provided URL");
  } catch (error) {
    console.error("Error scraping recipe:", error);
    throw new Error(`Failed to scrape recipe: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Extracts recipe data from JSON-LD structured data in HTML
 */
function extractJsonLdRecipe(html: string): Recipe | null {
  try {
    // Find all script tags with type="application/ld+json"
    const jsonLdRegex = /<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
    let match;
    
    while ((match = jsonLdRegex.exec(html)) !== null) {
      try {
        const jsonContent = match[1].trim();
        const parsedData = JSON.parse(jsonContent);
        
        // Handle both single objects and arrays of objects
        const jsonLdObjects = Array.isArray(parsedData) ? parsedData : [parsedData];
        
        // Look for Recipe type in JSON-LD
        for (const jsonLd of jsonLdObjects) {
          // Check if this is a Recipe or if it contains a Recipe
          if (jsonLd['@type'] === 'Recipe' || 
              (jsonLd['@graph'] && jsonLd['@graph'].some((item: any) => item['@type'] === 'Recipe'))) {
            
            // Get the recipe object
            const recipeObj = jsonLd['@type'] === 'Recipe' ? 
              jsonLd : 
              jsonLd['@graph'].find((item: any) => item['@type'] === 'Recipe');
            
            if (recipeObj) {
              return mapJsonLdToRecipe(recipeObj);
            }
          }
        }
      } catch (e) {
        console.warn('Error parsing JSON-LD content:', e);
        // Continue to next JSON-LD block if this one fails
      }
    }
    
    return null;
  } catch (error) {
    console.warn('Error extracting JSON-LD recipe:', error);
    return null;
  }
}

/**
 * Maps JSON-LD recipe data to our Recipe type
 */
function mapJsonLdToRecipe(jsonLd: any): Recipe {
  // Extract ingredients
  const ingredients: Ingredient[] = [];
  
  if (Array.isArray(jsonLd.recipeIngredient)) {
    jsonLd.recipeIngredient.forEach((ingredientStr: string) => {
      // Clean up the ingredient string before parsing
      const cleanedIngredientStr = cleanupText(ingredientStr);
      // Try to parse ingredient text into our structured format
      const ingredient = parseIngredientString(cleanedIngredientStr);
      if (ingredient) {
        ingredients.push(ingredient);
      }
    });
  }
  
  // Determine meal types based on keywords in recipe name and description
  const mealTypes = determineMealTypes(jsonLd.name, jsonLd.description);
  
  return {
    id: '',
    name: cleanupText(jsonLd.name) || 'Untitled Recipe',
    description: cleanupText(jsonLd.description) || '',
    ingredients,
    mealTypes: new Set(mealTypes)
  };
}

/**
 * Extracts recipe data from microdata in HTML
 */
function extractMicrodataRecipe(html: string): Recipe | null {
  try {
    // This is a simplified implementation - a full microdata parser would be more complex
    // Look for itemtype="http://schema.org/Recipe" or itemtype="https://schema.org/Recipe"
    const recipeBlockRegex = /<[^>]+itemtype=["']https?:\/\/schema\.org\/Recipe["'][^>]*>([\s\S]*?)<\/[^>]+>/i;
    const match = html.match(recipeBlockRegex);
    
    if (!match) return null;
    
    const recipeBlock = match[0];
    
    // Extract name
    const nameMatch = recipeBlock.match(/<[^>]+itemprop=["']name["'][^>]*>([\s\S]*?)<\/[^>]+>/i) ||
                      recipeBlock.match(/<[^>]+itemprop=["']name["'][^>]*content=["']([^"']+)["']/i);
    
    // Extract description
    const descriptionMatch = recipeBlock.match(/<[^>]+itemprop=["']description["'][^>]*>([\s\S]*?)<\/[^>]+>/i) ||
                             recipeBlock.match(/<[^>]+itemprop=["']description["'][^>]*content=["']([^"']+)["']/i);
    
    // Extract ingredients
    const ingredientMatches = [...recipeBlock.matchAll(/<[^>]+itemprop=["']recipeIngredient["'][^>]*>([\s\S]*?)<\/[^>]+>/gi)];
    const ingredients: Ingredient[] = [];
    
    ingredientMatches.forEach(match => {
      if (match[1]) {
        const ingredient = parseIngredientString(match[1].trim());
        if (ingredient) {
          ingredients.push(ingredient);
        }
      }
    });
    
    if (!nameMatch) return null; // Name is required
    
    const name = nameMatch[1] ? cleanupText(nameMatch[1]) : 'Untitled Recipe';
    const description = descriptionMatch && descriptionMatch[1] ? cleanupText(descriptionMatch[1]) : '';
    
    // Determine meal types
    const mealTypes = determineMealTypes(name, description);
    
    return {
      id: '',
      name,
      description,
      ingredients,
      mealTypes: new Set(mealTypes)
    };
  } catch (error) {
    console.warn('Error extracting microdata recipe:', error);
    return null;
  }
}

/**
 * Attempts to parse an ingredient string into our structured Ingredient format
 * This is a simplified implementation and may not work for all formats
 */
function parseIngredientString(ingredientStr: string): Ingredient | null {
  try {
    // Common units for matching
    const units = [
      'cup', 'cups', 'tbsp', 'tsp', 'tablespoon', 'tablespoons', 'teaspoon', 'teaspoons',
      'oz', 'ounce', 'ounces', 'lb', 'pound', 'pounds', 'g', 'gram', 'grams', 'kg',
      'ml', 'milliliter', 'milliliters', 'l', 'liter', 'liters', 'pinch', 'pinches',
      'dash', 'dashes', 'clove', 'cloves', 'piece', 'pieces', 'slice', 'slices',
      'can', 'cans', 'package', 'packages'
    ];
    
    // Regex to match quantity and unit
    // Matches patterns like: "2 cups", "1/2 tsp", "3.5 oz"
    const quantityUnitRegex = new RegExp(`^(\\d+(?:[\\./]\\d+)?)\\s*(${units.join('|')})?\\s+(.+)$`, 'i');
    
    const match = ingredientStr.match(quantityUnitRegex);
    
    if (match) {
      const [, quantityStr, unit, name] = match;
      
      // Parse the quantity (handle fractions like 1/2)
      let quantity: number;
      if (quantityStr.includes('/')) {
        const [numerator, denominator] = quantityStr.split('/').map(Number);
        quantity = numerator / denominator;
      } else {
        quantity = parseFloat(quantityStr);
      }
      
      return {
        name: cleanupText(name.trim()),
        quantity,
        unit: unit ? unit.trim() : ''
      };
    }
    
    // If we couldn't parse it, just use the string as the name with default values
    return {
      name: cleanupText(ingredientStr.trim()),
      quantity: 1,
      unit: ''
    };
  } catch (error) {
    console.warn('Error parsing ingredient string:', ingredientStr, error);
    return null;
  }
}

/**
 * Determines likely meal types based on recipe name and description
 */
function determineMealTypes(name: string, description: string): MealType[] {
  const text = `${name} ${description}`.toLowerCase();
  const mealTypes: MealType[] = [];
  
  // Keywords that suggest breakfast
  const breakfastKeywords = [
    'breakfast', 'pancake', 'waffle', 'oatmeal', 'cereal', 'muffin', 'toast',
    'bagel', 'egg', 'omelet', 'bacon', 'sausage', 'brunch', 'morning'
  ];
  
  // Keywords that suggest lunch
  const lunchKeywords = [
    'lunch', 'sandwich', 'wrap', 'salad', 'soup', 'quick', 'easy', 'light',
    'midday', 'noon'
  ];
  
  // Keywords that suggest dinner
  const dinnerKeywords = [
    'dinner', 'supper', 'roast', 'steak', 'chicken', 'beef', 'pork', 'fish',
    'pasta', 'casserole', 'hearty', 'evening', 'main course', 'entrée', 'entree'
  ];
  
  // Check for keyword matches
  if (breakfastKeywords.some(keyword => text.includes(keyword))) {
    mealTypes.push('breakfast');
  }
  
  if (lunchKeywords.some(keyword => text.includes(keyword))) {
    mealTypes.push('lunch');
  }
  
  if (dinnerKeywords.some(keyword => text.includes(keyword))) {
    mealTypes.push('dinner');
  }
  
  // Default to dinner if no meal types were determined
  if (mealTypes.length === 0) {
    mealTypes.push('dinner');
  }
  
  return mealTypes;
}
