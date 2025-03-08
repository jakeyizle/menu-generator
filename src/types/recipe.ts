export type MealType = 'breakfast' | 'lunch' | 'dinner'

export interface Ingredient {
    name: string
    quantity: number
    unit: string
  }
  
  export interface Recipe {
    id: string
    name: string
    description: string
    ingredients: Ingredient[]
    mealTypes: Set<MealType>
  }