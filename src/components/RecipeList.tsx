import { useState } from "react"
import { Link } from '@tanstack/react-router'
import { Edit, Trash2, Coffee, UtensilsCrossed, ChefHat } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MealType, Recipe } from "@/types/recipe"
import { DeleteRecipeDialog } from "@/components/DeleteRecipeDialog"
import { deleteRecipe } from "@/lib/db/recipes"

interface RecipeListProps {
    recipes: Recipe[]
}

export function RecipeList({ recipes }: RecipeListProps) {

    const [searchTerm, setSearchTerm] = useState("")
    const [mealTypeFilter, setMealTypeFilter] = useState("all")
    const [recipeToDelete, setRecipeToDelete] = useState<string | null>(null)

    const handleDelete = () => {
        if (recipeToDelete) {
            deleteRecipe(recipeToDelete)            
        }
    }

    const getMealTypeIcon = (type: string) => {
        switch (type) {
            case "breakfast":
                return <Coffee className="h-3 w-3" />
            case "lunch":
                return <UtensilsCrossed className="h-3 w-3" />
            case "dinner":
                return <ChefHat className="h-3 w-3" />
            default:
                return null
        }
    }
    const filteredRecipes = recipes.filter((recipe) => {
        const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesMealType = mealTypeFilter === "all" || recipe.mealTypes.has(mealTypeFilter as MealType)
        return matchesSearch && matchesMealType
    })

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <Input
                        placeholder="Search recipes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                    />
                </div>
                <div className="w-full sm:w-48">
                    <Select value={mealTypeFilter} onValueChange={setMealTypeFilter}>
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by meal type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Meal Types</SelectItem>
                            <SelectItem value="breakfast">Breakfast</SelectItem>
                            <SelectItem value="lunch">Lunch</SelectItem>
                            <SelectItem value="dinner">Dinner</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {filteredRecipes?.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-muted-foreground">No recipes found. Try a different search or add a new recipe.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRecipes.map((recipe) => (
                        <Card key={recipe.id} className="flex flex-col bg-card">
                            <CardHeader className="flex-none pb-3">
                                <CardTitle className="text-xl line-clamp-1">{recipe.name}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col">
                                <div className="h-[3.5rem] mb-1">
                                    <p className="text-muted-foreground line-clamp-2">{recipe.description}</p>
                                </div>
                                <div className="mt-auto">
                                    <div className="flex flex-wrap gap-2 mb-2 min-h-[2rem]">
                                        {[...recipe.mealTypes].map((type) => (
                                            <Badge key={type} variant="secondary" className="flex items-center gap-1.5 py-1 px-2 text-xs">
                                                {getMealTypeIcon(type)}
                                                {type.charAt(0).toUpperCase() + type.slice(1)}
                                            </Badge>
                                        ))}
                                    </div>
                                    <p className="text-sm text-muted-foreground">{recipe.ingredients.length} ingredients</p>
                                </div>
                            </CardContent>
                            <CardFooter className="flex-none justify-between border-t pt-4">
                                <Link to={'/recipes/$recipeId'}
                                    params={{
                                        recipeId: recipe.id
                                    }}>
                                    <Button variant="outline" size="sm">
                                        View Recipe
                                    </Button>
                                </Link>
                                <div className="flex gap-2">
                                    <Link to={'/recipes/$recipeId/edit'}
                                        params={{
                                            recipeId: recipe.id
                                        }}>
                                        <Button variant="ghost" size="icon">
                                            <Edit className="h-4 w-4" />
                                            <span className="sr-only">Edit</span>
                                        </Button>
                                    </Link>
                                    <Button variant="ghost" size="icon" onClick={() => setRecipeToDelete(recipe.id)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                        <span className="sr-only">Delete</span>
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}

            <DeleteRecipeDialog
        isOpen={!!recipeToDelete}        
        onClose={() => setRecipeToDelete(null)}
        onDelete={handleDelete}
      />
        </div>
    )
}
