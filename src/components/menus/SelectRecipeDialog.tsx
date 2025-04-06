import { MenuItem, Recipe } from "@/types/types"
import { ScrollArea } from "../ScrollArea"
import { Button } from "../ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"

export interface SelectRecipeDialogProps {
    meal: MenuItem
    recipes: Recipe[]
    dayIndex: number
    mealIndex: number
    onChangeMeal: (dayIndex: number, mealIndex: number, recipe: Recipe) => void
}

export const SelectRecipeDialog = ({meal, recipes, dayIndex, mealIndex, onChangeMeal }: SelectRecipeDialogProps) => {
    return (
        <Dialog>
        <DialogTrigger asChild>
            <Button variant="outline" size="sm">
                {meal.recipe.id ? "Change Recipe" : "Select Recipe"}
            </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
            <DialogHeader>
                <DialogTitle>
                    Select {meal.type.charAt(0).toUpperCase() + meal.type.slice(1)} Recipe
                </DialogTitle>
                <DialogDescription>Choose a recipe for this meal</DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[60vh] mt-4 pr-4">
                <div className="space-y-4">
                    {recipes
                        .filter((recipe) => [...recipe.mealTypes].includes(meal.type))
                        .map((recipe) => (
                            <div
                                key={recipe.id}
                                className={`p-4 rounded-md border cursor-pointer hover:bg-muted transition-colors ${recipe.id === meal.recipe.id ? "bg-muted border-primary" : ""
                                    }`}
                                onClick={() => onChangeMeal(dayIndex, mealIndex, recipe)}
                            >
                                <div className="font-medium">{recipe.name}</div>
                                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                    {recipe.description}
                                </p>
                                <div className="text-xs text-muted-foreground mt-2">
                                    {recipe.ingredients.length} ingredients
                                </div>
                            </div>
                        ))}
                </div>
            </ScrollArea>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline">
                        Close
                    </Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    )
}