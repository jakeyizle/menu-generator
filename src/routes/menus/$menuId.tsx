import { useQueryErrorResetBoundary, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, ErrorComponentProps, useRouter, ErrorComponent } from '@tanstack/react-router'
import React from 'react'
import { menuQueryOptions } from '@/menuQueryOptions'
import { MenuNotFoundError } from '@/lib/db/menus'
import MenuView from '@/components/menus/MenuView'

export const Route = createFileRoute('/menus/$menuId')({
  loader: ({ context: { queryClient }, params: { menuId } }) => queryClient.ensureQueryData(menuQueryOptions(menuId)),
  errorComponent: MenuErrorComponent,
  component: RouteComponent,
})

function MenuErrorComponent({ error }: ErrorComponentProps) {
  const router = useRouter()
  if (error instanceof MenuNotFoundError) {
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
  const menuId = Route.useParams().menuId
  const { data: menu } = useSuspenseQuery(menuQueryOptions(menuId))

  return (
    <MenuView menu={menu} />
  )
}
