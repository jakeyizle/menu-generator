import { MenuForm } from '@/components/menus/MenuForm'
import { useQueryErrorResetBoundary, useSuspenseQueries, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, ErrorComponentProps, useRouter, ErrorComponent } from '@tanstack/react-router'
import { menuQueryOptions } from '@/menuQueryOptions'
import { MenuNotFoundError } from '@/lib/db/menus'
import {useEffect} from 'react'
import { recipesQueryOptions } from '@/recipesQueryOptions'

export const Route = createFileRoute('/menus_/$menuId/edit')({
  loader: ({ context: { queryClient }, params: { menuId } }) => {
    queryClient.ensureQueryData(menuQueryOptions(menuId))
    queryClient.ensureQueryData(recipesQueryOptions)
  },
  errorComponent: MenuErrorComponent,
  component: RouteComponent,
})

function MenuErrorComponent({ error }: ErrorComponentProps) {
  const router = useRouter()
  if (error instanceof MenuNotFoundError) {
    return <div>{error.message}</div>
  }
  const queryErrorResetBoundary = useQueryErrorResetBoundary()

  useEffect(() => {
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
  const menuId = Route.useParams().menuId
  const [{ data: menu }, { data: recipes }] = useSuspenseQueries({queries: [
    menuQueryOptions(menuId),
    recipesQueryOptions,
  ]})

  return (
    <MenuForm initialData={menu} recipes={recipes}/>
  )
}
