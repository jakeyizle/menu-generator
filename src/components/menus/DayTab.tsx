import { MenuDay, Recipe } from "@/types/types"
import { TabsContent } from "../ui/tabs"
import { MealCard } from "./MealCard"

export interface DayTabProps {
    dayIndex: number
    day: MenuDay
    recipes: Recipe[]
    onChangeMeal: (dayIndex: number, mealIndex: number, recipe: Recipe) => void
}

export const DayTab = ({dayIndex, day, recipes, onChangeMeal }: DayTabProps) => {
    return (
        <>
        <TabsContent key={dayIndex} value={`day${dayIndex + 1}`} className="space-y-4">
        {day.meals.map((meal, mealIndex) => (
            <MealCard key={mealIndex} meal={meal} recipes={recipes} dayIndex={dayIndex} mealIndex={mealIndex} onChangeMeal={onChangeMeal} />
        ))}
    </TabsContent>
    </>
    )
}