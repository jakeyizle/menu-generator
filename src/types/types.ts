// types have to be in 1 file because of the the express server

export type MealType = 'breakfast' | 'lunch' | 'dinner'

export interface Ingredient {
    name: string
    quantity: number
    unit: string
  }
  
export interface Recipe {
    id: string
    name: string
    url: string
    description: string
    ingredients: Ingredient[]
    mealTypes: Set<MealType>
    servings: number
  }

  export interface MenuItem {
    type: MealType
    recipe: Recipe
  }
  
  export interface MenuDay {
    day: string
    meals: MenuItem[]
  }
  
  export interface Menu {
    id: string
    name: string
    description: string
    createdAt: string
    numberOfDays: number
    days: MenuDay[]
  }
