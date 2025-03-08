import { queryOptions } from '@tanstack/react-query'
import { getRecipes } from './lib/db/recipes'

export const recipesQueryOptions = queryOptions({
  queryKey: ['recipes'],
  queryFn: () => getRecipes(),
})