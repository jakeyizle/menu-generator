import type React from "react"

import { useState } from "react"
import { PlusCircle, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import type { Recipe, Ingredient, MealType } from "@/types/types"
import { Link } from "@tanstack/react-router"
import { createRecipe, updateRecipe } from "@/lib/db/recipes"
import { useNavigate } from "@tanstack/react-router"
import { RecipeImporter } from "./RecipeImporter"
import { Separator } from "../ui/separator"

interface RecipeFormProps {
    initialData?: Recipe
}

export function RecipeForm({ initialData }: RecipeFormProps) {
    const navigate = useNavigate()
    const isEditing = !!initialData

    const [formData, setFormData] = useState<Recipe>(
        initialData || {
            id: '',
            name: "",
            url: "",
            description: "",
            ingredients: [],
            mealTypes: new Set(),
            servings: 4,
        },
    )

    const [newIngredient, setNewIngredient] = useState<Ingredient>({
        name: "",
        quantity: 0,
        unit: "",
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (isEditing) {
            updateRecipe(formData)
        } else {
            createRecipe(formData)
        }

        navigate({ to: "/recipes" })
    }

    const handleAddIngredient = () => {
        if (newIngredient.name && newIngredient.quantity > 0 && newIngredient.unit) {
            setFormData({
                ...formData,
                ingredients: [...formData.ingredients, { ...newIngredient }],
            })
            setNewIngredient({ name: "", quantity: 0, unit: "" })
        }
    }

    const handleRemoveIngredient = (index: number) => {
        const updatedIngredients = [...formData.ingredients]
        updatedIngredients.splice(index, 1)
        setFormData({ ...formData, ingredients: updatedIngredients })
    }

    const handleMealTypeChange = (mealType: MealType) => {
        const updatedMealTypes = new Set(
            formData.mealTypes.has(mealType)
                ? [...formData.mealTypes].filter((type) => type !== mealType)
                : [...formData.mealTypes, mealType]
        )
        setFormData({ ...formData, mealTypes: updatedMealTypes })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
            <RecipeImporter onImportSuccess={(recipe) => setFormData(recipe)} />
                <Separator />
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Recipe Name</Label>
                    <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter recipe name"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="url">URL</Label>
                    <Input
                        id="url"
                        value={formData.url}
                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                        placeholder="Enter recipe URL" />
                    </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Describe your recipe"
                        rows={3}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="servings">Number of Servings</Label>
                    <Input
                        id="servings"
                        type="number"
                        min="1"
                        value={formData.servings}
                        onChange={(e) => setFormData({ ...formData, servings: Number(e.target.value) })}                        
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label>Meal Types</Label>
                    <div className="flex flex-wrap gap-4 mt-2">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="breakfast"
                                checked={formData.mealTypes.has("breakfast")}
                                onCheckedChange={() => handleMealTypeChange("breakfast")}
                            />
                            <Label htmlFor="breakfast" className="cursor-pointer">
                                Breakfast
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="lunch"
                                checked={formData.mealTypes.has("lunch")}
                                onCheckedChange={() => handleMealTypeChange("lunch")}
                            />
                            <Label htmlFor="lunch" className="cursor-pointer">
                                Lunch
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="dinner"
                                checked={formData.mealTypes.has("dinner")}
                                onCheckedChange={() => handleMealTypeChange("dinner")}
                            />
                            <Label htmlFor="dinner" className="cursor-pointer">
                                Dinner
                            </Label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <Label>Ingredients</Label>
                <Card>
                    <CardContent className="p-4">
                        {formData.ingredients.length > 0 ? (
                            <ul className="space-y-2 mb-4">
                                {formData.ingredients.map((ingredient, index) => (
                                    <li key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                                        <span>
                                            {ingredient.quantity} {ingredient.unit} {ingredient.name}
                                        </span>
                                        <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveIngredient(index)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                            <span className="sr-only">Remove</span>
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-muted-foreground text-center py-4">No ingredients added yet</p>
                        )}

                        <div className="flex flex-wrap gap-2 items-end">
                            <div className="w-20">
                                <Label htmlFor="quantity">Quantity</Label>
                                <Input
                                    id="quantity"
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    value={newIngredient.quantity || ""}
                                    onChange={(e) => setNewIngredient({ ...newIngredient, quantity: Number.parseFloat(e.target.value) })}
                                />
                            </div>
                            <div className="w-24">
                                <Label htmlFor="unit">Unit</Label>
                                <Input
                                    id="unit"
                                    value={newIngredient.unit}
                                    onChange={(e) => setNewIngredient({ ...newIngredient, unit: e.target.value })}
                                    placeholder="g, ml, cup"
                                />
                            </div>
                            <div className="flex-1">
                                <Label htmlFor="ingredientName">Ingredient</Label>
                                <Input
                                    id="ingredientName"
                                    value={newIngredient.name}
                                    onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
                                    placeholder="Ingredient name"
                                />
                            </div>
                            <Button
                                type="button"
                                onClick={handleAddIngredient}
                                disabled={!newIngredient.name || !newIngredient.quantity || !newIngredient.unit}
                            >
                                <PlusCircle className="h-4 w-4 mr-2" />
                                Add
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex gap-4">
                <Button type="submit">{isEditing ? "Update Recipe" : "Create Recipe"}</Button>
                <Link to="/recipes">
                    <Button type="button" variant="outline">
                        Cancel
                    </Button>
                </Link>
            </div>
        </form>
    )
}
