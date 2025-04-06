import { queryOptions } from '@tanstack/react-query'
import { getMenus } from './lib/db/menus'

export const menusQueryOptions = queryOptions({
  queryKey: ['menus'],
  queryFn: () => getMenus(),
})