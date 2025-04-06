import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ScrollArea"
import { Separator } from "@/components/ui/separator"
import { FileDown, ShoppingBag } from "lucide-react"

interface Ingredient {
  name: string
  quantity: number
  unit: string
}

interface ShoppingListDialogProps {
  ingredients: Ingredient[]
  numberOfDays: number
}

export function ShoppingListDialog({ ingredients, numberOfDays }: ShoppingListDialogProps) {
  // Group ingredients by category (in a real app, you'd have proper categories)
  const categories = {
    Produce: [
      "Tomatoes",
      "Onions",
      "Garlic",
      "Bell Peppers",
      "Carrots",
      "Broccoli",
      "Spinach",
      "Lettuce",
      "Avocado",
      "Mushrooms",
      "Corn",
    ],
    "Meat & Seafood": ["Chicken", "Beef", "Pork"],
    "Dairy & Eggs": ["Cheese", "Milk", "Eggs", "Butter"],
    "Grains & Pasta": ["Rice", "Pasta", "Bread", "Flour"],
    "Pantry Items": ["Olive Oil", "Salt", "Pepper", "Sugar", "Beans", "Lentils"],
    Other: [],
  }

  // Categorize ingredients
  const categorizedIngredients: Record<string, Ingredient[]> = {}

  ingredients.forEach((ingredient) => {
    let category = "Other"
    for (const [cat, items] of Object.entries(categories)) {
      if (items.some((item) => ingredient.name.toLowerCase().includes(item.toLowerCase()))) {
        category = cat
        break
      }
    }

    if (!categorizedIngredients[category]) {
      categorizedIngredients[category] = []
    }
    categorizedIngredients[category].push(ingredient)
  })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <ShoppingBag className="h-4 w-4 mr-2" />
          Shopping List
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Shopping List</DialogTitle>
          <DialogDescription>All the ingredients you'll need for your {numberOfDays}-day meal plan</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] mt-4">
          <div className="space-y-6 pr-4">
            {Object.entries(categorizedIngredients).map(
              ([category, items]) =>
                items.length > 0 && (
                  <div key={category}>
                    <h3 className="font-medium mb-2">{category}</h3>
                    <ul className="space-y-2">
                      {items.map((item, index) => (
                        <li key={index} className="flex items-center">
                          <div className="flex-1">{item.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {item.quantity} {item.unit}
                          </div>
                        </li>
                      ))}
                    </ul>
                    <Separator className="mt-4" />
                  </div>
                ),
            )}
          </div>
        </ScrollArea>
        <div className="flex justify-between pt-4">
          <Button variant="outline" size="sm">
            <FileDown className="h-4 w-4 mr-2" />
            Download List
          </Button>
          <Button size="sm">Print List</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

