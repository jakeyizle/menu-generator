import { RecipeForm } from '@/components/RecipeForm'
import { useQueryErrorResetBoundary, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, ErrorComponentProps, useRouter, ErrorComponent } from '@tanstack/react-router'
import { recipeQueryOptions } from '@/recipeQueryOptions'
import { RecipeNotFoundError } from '@/lib/db/recipes'
import React from 'react'

export const Route = createFileRoute('/recipes_/$recipeId/edit')({
  loader: ({ context: { queryClient }, params: { recipeId } }) => queryClient.ensureQueryData(recipeQueryOptions(recipeId)),
  errorComponent: RecipeErrorComponent,
  component: RouteComponent,
})

function RecipeErrorComponent({ error }: ErrorComponentProps) {
  const router = useRouter()
  if (error instanceof RecipeNotFoundError) {
    return <div>{error.message}</div>
  }
  const queryErrorResetBoundary = useQueryErrorResetBoundary()

  React.useEffect(() => {
    queryErrorResetBoundary.reset()
  }, [queryErrorResetBoundary])

  return (
    <div>
      <button onClick={() => { router.invalidate() }}>Refresh</button>
      <ErrorComponent error={error} />
    </div>
  )
}

function RouteComponent() {
  const recipeId = Route.useParams().recipeId
  const { data: recipe } = useSuspenseQuery(recipeQueryOptions(recipeId))

  return (
    <RecipeForm initialData={recipe} />
  )
}
