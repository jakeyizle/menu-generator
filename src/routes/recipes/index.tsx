import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { RecipeList } from '@/components/RecipeList'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { recipesQueryOptions } from '@/recipesQueryOptions'

export const Route = createFileRoute('/recipes/')({
  loader: ({context : {queryClient}}) => queryClient.ensureQueryData(recipesQueryOptions),
  component: RecipeComponent,
})

function RecipeComponent() {
  const recipesQuery = useSuspenseQuery(recipesQueryOptions)
  const recipes = recipesQuery.data

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold tracking-tight">All Recipes</h2>
        <Link to="/recipes/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Recipe
          </Button>
        </Link>
      </div>
      <RecipeList recipes={recipes} />
      </>
  )
}
