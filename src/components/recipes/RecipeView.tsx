import { ArrowLeft, Edit, Trash2, Coffee, UtensilsCrossed, ChefHat } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { DeleteDialog } from "../DeleteDialog"
import { useState } from "react"
import { Recipe } from "@/types/types"
import { Link, useRouter } from "@tanstack/react-router"
import { deleteRecipe } from "@/lib/db/recipes"

interface RecipeViewProps {
    recipe: Recipe
}

export default function RecipeView({ recipe }: RecipeViewProps) {
    const router = useRouter()
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)

    const handleDelete = async () => {
        await deleteRecipe(recipe.id)
        router.history.back()
    }

    const getMealTypeIcon = (type: string) => {
        switch (type) {
            case "breakfast":
                return <Coffee className="h-4 w-4" />
            case "lunch":
                return <UtensilsCrossed className="h-4 w-4" />
            case "dinner":
                return <ChefHat className="h-4 w-4" />
            default:
                return null
        }
    }

    return (
        <div className="container">
            <div className="flex items-center mb-6">
                <Button variant="ghost" onClick={() => router.history.back()} className="mr-4">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>
                <h1 className="text-3xl font-bold flex-1">{recipe.name}</h1>
                <div className="flex gap-2">
                    <Link to={'/recipes/$recipeId/edit'} params={{ recipeId: recipe.id }}>
                        <Button variant="outline">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                        </Button>
                    </Link>
                    <Button variant="outline" className="text-destructive" onClick={() => setShowDeleteDialog(true)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                    </Button>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
                {[...recipe.mealTypes].map((type) => (
                    <Badge key={type} variant="secondary" className="flex items-center gap-1 text-sm py-1 px-3">
                        {getMealTypeIcon(type)}
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Badge>
                ))}
            </div>

            <div className="mb-8">
                <p className="text-lg text-muted-foreground">{recipe.description}</p>
                {recipe.url && (
                    <p className="text-md mt-2">
                        Source: <a href={recipe.url} target="_blank" rel="noopener noreferrer" className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600">{recipe.url}</a>
                    </p>
                )}
                <p className="text-md mt-2">Servings: <span className="font-medium">{recipe.servings}</span></p>
            </div>

            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Ingredients</h2>
                <Card>
                    <CardContent className="p-6">
                        <ul className="space-y-2">
                            {recipe.ingredients.map((ingredient, index) => (
                                <li key={index} className="flex items-center">
                                    <span className="font-medium">
                                        {ingredient.quantity} {ingredient.unit}
                                    </span>
                                    <span className="mx-2">•</span>
                                    <span>{ingredient.name}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>

            <DeleteDialog isOpen={showDeleteDialog} onClose={() => { setShowDeleteDialog(false) }} onDelete={handleDelete} />
        </div>
    )
}
