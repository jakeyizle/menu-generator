import { MenuForm } from '@/components/menus/MenuForm'
import { recipesQueryOptions } from '@/recipesQueryOptions'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/menus/new')({
    loader: ({context : {queryClient}}) => queryClient.ensureQueryData(recipesQueryOptions),
  component: RouteComponent,
})

function RouteComponent() {
  const recipesQuery = useSuspenseQuery(recipesQueryOptions)
  const recipes = recipesQuery.data
  
  return (
    <>
    <h1 className="text-3xl font-bold mb-8">Create New Menu</h1>
    <MenuForm recipes={recipes}/>
  </>
  )
}
