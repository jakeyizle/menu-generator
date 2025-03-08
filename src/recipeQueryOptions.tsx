import { queryOptions } from '@tanstack/react-query'
import { getRecipe } from './lib/db/recipes'

export const recipeQueryOptions = (recipeId: string) => queryOptions({
    queryKey: ['recipes', recipeId],
    queryFn: () => getRecipe(recipeId),
  })