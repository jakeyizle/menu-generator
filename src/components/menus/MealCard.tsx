import { MenuItem, Recipe } from "@/types/types"
import { Badge } from "../ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { SelectRecipeDialog } from "./SelectRecipeDialog"

export interface MealCardProps {
    meal: MenuItem
    recipes: Recipe[]
    dayIndex: number
    mealIndex: number
    onChangeMeal: (dayIndex: number, mealIndex: number, recipe: Recipe) => void
}

export const MealCard = ({meal, recipes, dayIndex, mealIndex, onChangeMeal }: MealCardProps) => {
    return (
        <Card key={mealIndex}>
        <CardHeader className="pb-2">
            <Badge className="w-fit mb-2 capitalize">{meal.type}</Badge>
            {meal.recipe.id ? (
                <CardTitle className="text-lg">{meal.recipe.name}</CardTitle>
            ) : (
                <CardTitle className="text-lg text-muted-foreground">Select a recipe</CardTitle>
            )}
        </CardHeader>
        <CardContent>
            {meal.recipe.id ? (
                <>
                    <p className="text-muted-foreground text-sm mb-2">{meal.recipe.description}</p>
                    <div className="text-sm mb-4">
                        <span className="font-medium">{meal.recipe.ingredients.length} ingredients</span>
                    </div>
                </>
            ) : (
                <p className="text-muted-foreground text-sm mb-4">No recipe selected for this meal</p>
            )}
            <SelectRecipeDialog meal={meal} recipes={recipes} dayIndex={dayIndex} mealIndex={mealIndex} onChangeMeal={onChangeMeal} />
        </CardContent>
    </Card>
    )
}
