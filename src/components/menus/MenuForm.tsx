import type React from "react"

import { useState } from "react"
import { ChefHat, Loader2, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ScrollArea"
import type { Menu, MenuDay, Recipe, MealType } from "@/types/types"
import { Link } from "@tanstack/react-router"
import { createMenu, updateMenu } from "@/lib/db/menus"
import { useNavigate } from "@tanstack/react-router"
import { MenuDaySelector } from "./MenuDaySelector"
import { SelectRecipeDialog } from "./SelectRecipeDialog"
import { MealCard } from "./MealCard"
import { DayTab } from "./DayTab"


interface MenuFormProps {
    initialData?: Menu
    recipes: Recipe[]
}

const mealTypes = ["breakfast", "lunch", "dinner"] as MealType[]

// Move the mealTypes declaration to the top, before any function calls
export function MenuForm({ initialData, recipes }: MenuFormProps) {
    const navigate = useNavigate()
    const isEditing = !!initialData

    const [formData, setFormData] = useState<Menu>({
        id: initialData?.id || '',
        createdAt: initialData?.createdAt || '',
        name: initialData?.name || "",
        description: initialData?.description || "",
        numberOfDays: initialData?.numberOfDays || 3,
        days: initialData?.days || generateEmptyDays(3, mealTypes),
    })

    const [isGenerating, setIsGenerating] = useState(false)
    const [activeTab, setActiveTab] = useState("day1")
    const [validationError, setValidationError] = useState(false)
    function generateEmptyDays(numberOfDays: number, mealTypes: MealType[]): MenuDay[] {
        return Array.from({ length: numberOfDays }, (_, i) => ({
            day: `Day ${i + 1}`,
            meals: mealTypes.map((type) => ({
                type,
                recipe: {
                    id: "",
                    name: "",
                    description: "",
                    ingredients: [],
                    mealTypes: new Set([type]),
                    servings: 0,
                    url: "",
                },
            })),
        }))
    }

    const handleNumberOfDaysChange = (value: number[]) => {
        const newNumberOfDays = value[0]

        if (newNumberOfDays > formData.numberOfDays) {
            // Add more days
            const newDays = [
                ...formData.days,
                ...generateEmptyDays(newNumberOfDays - formData.numberOfDays, mealTypes).map((day, index) => ({
                    ...day,
                    day: `Day ${formData.numberOfDays + index + 1}`,
                })),
            ]
            setFormData({ ...formData, numberOfDays: newNumberOfDays, days: newDays })
        } else if (newNumberOfDays < formData.numberOfDays) {
            // Remove days
            const newDays = formData.days.slice(0, newNumberOfDays)
            setFormData({ ...formData, numberOfDays: newNumberOfDays, days: newDays })

            // If the active tab is for a day that no longer exists, switch to the last day
            const activeTabNumber = Number.parseInt(activeTab.replace("day", ""))
            if (activeTabNumber > newNumberOfDays) {
                setActiveTab(`day${newNumberOfDays}`)
            }
        } else {
            setFormData({ ...formData, numberOfDays: newNumberOfDays })
        }
    }

    const handleChangeMeal = (dayIndex: number, mealIndex: number, recipe: Recipe) => {
        const updatedDays = [...formData.days]
        updatedDays[dayIndex].meals[mealIndex].recipe = recipe
        setValidationError(false)
        setFormData({ ...formData, days: updatedDays })
    }

    const handleAutoGenerateMenu = () => {
        // setIsGenerating(true)

        // // Simulate menu generation
        // setTimeout(() => {
        //   const generatedDays = formData.days.map((day) => ({
        //     ...day,
        //     meals: day.meals.map((meal) => ({
        //       ...meal,
        //       recipe:
        //         recipes.filter((recipe) => recipe.mealTypes.includes(meal.type))[
        //           Math.floor(Math.random() * recipes.filter((recipe) => recipe.mealTypes.includes(meal.type)).length)
        //         ] || recipes[0],
        //     })),
        //   }))

        //   setFormData({ ...formData, days: generatedDays })
        //   setIsGenerating(false)

        //   toast({
        //     title: "Menu generated",
        //     description: "Your menu has been auto-generated with random recipes",
        //   })
        // }, 1000)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // Check if all meals have recipes
        const hasEmptyMeals = formData.days.some((day) => day.meals.some((meal) => !meal.recipe.id))

        if (hasEmptyMeals) {
            setValidationError(true)
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
            return
        }
        
        setValidationError(false)

        if (isEditing) {
            updateMenu(formData)
        } else {
            createMenu(formData)
        }

        navigate({ to: "/menus" })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
            {validationError && (
                <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Please select a recipe for each meal before submitting the menu.
                    </AlertDescription>
                </Alert>
            )}
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Menu Name</Label>
                    <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Weekly Dinner Plan"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="A balanced meal plan for the week"
                        rows={3}
                    />
                </div>

                <MenuDaySelector numberOfDays={formData.numberOfDays} onNumberOfDaysChange={handleNumberOfDaysChange} />
            </div>

            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Plan Your Meals</h2>
                <Button type="button" variant="outline" onClick={handleAutoGenerateMenu} disabled={isGenerating}>
                    {isGenerating ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                        </>
                    ) : (
                        <>
                            <ChefHat className="mr-2 h-4 w-4" />
                            Auto-Generate Menu
                        </>
                    )}
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Meal Plan</CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="mb-4">
                            {formData.days.map((day, index) => (
                                <TabsTrigger key={index} value={`day${index + 1}`}>
                                    {day.day}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        {formData.days.map((day, dayIndex) => (
                            <DayTab key={dayIndex} dayIndex={dayIndex} day={day} recipes={recipes} onChangeMeal={handleChangeMeal} />
                        ))}
                    </Tabs>
                </CardContent>
            </Card>

            <div className="flex gap-4">
                <Button type="submit">{isEditing ? "Update Menu" : "Create Menu"}</Button>
                <Link to="/menus">
                    <Button type="button" variant="outline">
                        Cancel
                    </Button>
                </Link>
            </div>
        </form>
    )
}
