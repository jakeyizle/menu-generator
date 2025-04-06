import { Link, useRouter } from "@tanstack/react-router"
import { ArrowLeft, Edit, Trash2, Calendar, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { DeleteDialog } from "../DeleteDialog"
import { ShoppingListDialog } from "./ShoppingListDialog"

import { formatDistanceToNow } from "date-fns"
import { useState } from "react"
import { Menu } from "@/types/types"
import { deleteMenu } from "@/lib/db/menus"

export default function MenuDetailPage({ menu }: { menu: Menu }) {
    const router = useRouter()
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)

    if (!menu) {
        return (
            <div className="container py-10 text-center">
                <h1 className="text-2xl font-bold mb-4">Menu not found</h1>
                <Link to="/menus">
                    <Button>Back to Menus</Button>
                </Link>
            </div>
        )
    }

    // Generate a shopping list from the menu
    const generateShoppingList = () => {
        // Collect all ingredients from all recipes
        return menu.days.flatMap((day) => day.meals.flatMap((meal) => meal.recipe.ingredients))
    }

    const handleDelete = async () => {
        await deleteMenu(menu.id)
        router.history.back()
    }
    return (
        <div className="container py-10">
            <div className="flex items-center mb-6">
                <Button variant="ghost" onClick={() => router.history.back()} className="mr-4">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold">{menu.name}</h1>
                    <div className="flex items-center text-muted-foreground mt-1">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="text-sm">
                            Created {formatDistanceToNow(new Date(menu.createdAt), { addSuffix: true })}
                        </span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <ShoppingListDialog ingredients={generateShoppingList()} numberOfDays={menu.numberOfDays} />
                    <Link to={'/menus/$menuId/edit'} params={{ menuId: menu.id }}>
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

            {menu.description && (
                <div className="mb-8">
                    <p className="text-lg text-muted-foreground">{menu.description}</p>
                </div>
            )}

            <div className="flex items-center gap-2 mb-8">
                <Badge variant="outline" className="flex items-center gap-1 text-sm py-1 px-3">
                    <Calendar className="h-4 w-4" />
                    {menu.numberOfDays} {menu.numberOfDays === 1 ? "day" : "days"}
                </Badge>
                <Badge variant="outline" className="text-sm py-1 px-3">
                    {menu.days.reduce((total, day) => total + day.meals.length, 0)} meals
                </Badge>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Meal Plan</CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="day1">
                        <TabsList className="mb-4">
                            {menu.days.map((day, index) => (
                                <TabsTrigger key={index} value={`day${index + 1}`}>
                                    {day.day}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        {menu.days.map((day, dayIndex) => (
                            <TabsContent key={dayIndex} value={`day${dayIndex + 1}`} className="space-y-4">
                                {day.meals.map((meal, mealIndex) => (
                                    <Card key={mealIndex}>
                                        <CardHeader className="pb-2">
                                            <Badge className="w-fit mb-2 capitalize">{meal.type}</Badge>
                                            <CardTitle className="text-lg">{meal.recipe.name}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-muted-foreground text-sm mb-2">{meal.recipe.description}</p>
                                            <div className="text-sm">
                                                <span className="font-medium">{meal.recipe.ingredients.length} ingredients</span>
                                            </div>
                                            <div className="mt-4">
                                                <Link to={'/recipes/$recipeId'} params={{ recipeId: meal.recipe.id }}>
                                                    <Button variant="outline" size="sm">
                                                        View Recipe
                                                    </Button>
                                                </Link>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </TabsContent>
                        ))}
                    </Tabs>
                </CardContent>
            </Card>

            <DeleteDialog isOpen={showDeleteDialog} onDelete={handleDelete} onClose={() => setShowDeleteDialog(false)} />
        </div>
    )
}

