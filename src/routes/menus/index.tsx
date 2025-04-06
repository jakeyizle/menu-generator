import { createFileRoute, Link } from '@tanstack/react-router'
import { RecipeList } from '@/components/recipes/RecipeList'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { menusQueryOptions } from '@/menusQueryOptions'
import { MenuList } from '@/components/menus/MenuList'


export const Route = createFileRoute('/menus/')({
  loader: ({ context: { queryClient } }) => queryClient.ensureQueryData(menusQueryOptions),
  component: RouteComponent,
})

function RouteComponent() {
  const menusQuery = useSuspenseQuery(menusQueryOptions)
  const menus = menusQuery.data


  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold tracking-tight">All Menus</h2>
        <Link to="/menus/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Menu
          </Button>
        </Link>
      </div>
      <MenuList menus={menus} />
    </>
  )
}