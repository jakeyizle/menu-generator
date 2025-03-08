import { useState } from "react"
import { LinkIcon, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Recipe } from "@/types/recipe"
import { scrapeRecipe } from "@/lib/scrapeRecipe"

interface RecipeImporterProps {
    onImportSuccess: (recipe: Recipe) => void
    disabled?: boolean
}

export function RecipeImporter({ onImportSuccess, disabled = false }: RecipeImporterProps) {
    const [recipeUrl, setRecipeUrl] = useState("")
    const [isScraping, setIsScraping] = useState(false)
    const [scrapeError, setScrapeError] = useState<string | null>(null)
    const [scrapeSuccess, setScrapeSuccess] = useState(false)

    const handleScrapeRecipe = async () => {
        if (!recipeUrl) return

        setIsScraping(true)
        setScrapeError(null)
        setScrapeSuccess(false)

        try {
            const recipe = await scrapeRecipe(recipeUrl)
            onImportSuccess(recipe)
            setScrapeSuccess(true)
            // Optionally clear the URL after successful import
            setRecipeUrl("")
        } catch (error) {
            setScrapeError(error instanceof Error ? error.message : "An error occurred while importing the recipe.")
        } finally {
            setIsScraping(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Import Recipe</CardTitle>
                <CardDescription>Have a recipe from a website? Paste the URL below to import it automatically.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <Input
                            placeholder="https://example.com/recipe"
                            value={recipeUrl}
                            onChange={(e) => setRecipeUrl(e.target.value)}
                            disabled={isScraping || disabled}
                        />
                    </div>
                    <Button type="button" onClick={handleScrapeRecipe} disabled={isScraping || !recipeUrl || disabled}>
                        {isScraping ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Importing...
                            </>
                        ) : (
                            <>
                                <LinkIcon className="mr-2 h-4 w-4" />
                                Import Recipe
                            </>
                        )}
                    </Button>
                </div>

                {scrapeError && (
                    <Alert variant="destructive" className="mt-4">
                        <AlertDescription>{scrapeError}</AlertDescription>
                    </Alert>
                )}

                {scrapeSuccess && (
                    <Alert className="mt-4 bg-green-50 text-green-800 border-green-200">
                        <AlertDescription>Recipe imported successfully! Review and edit the details below.</AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
    )
}

