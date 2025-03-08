import express from 'express';
import { scrapeRecipe } from '../utils/scraper.js';
const router = express.Router();
// Endpoint to scrape a recipe from a URL
router.post('/scrape', async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) {
            res.status(400).json({ error: 'URL is required' });
        }
        const recipe = await scrapeRecipe(url);
        res.json(recipe);
    }
    catch (error) {
        console.error('Error scraping recipe:', error);
        res.status(500).json({
            error: `Failed to scrape recipe: ${error instanceof Error ? error.message : String(error)}`
        });
    }
});
export default router;
//# sourceMappingURL=recipes.js.map