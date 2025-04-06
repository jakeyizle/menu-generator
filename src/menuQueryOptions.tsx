import { queryOptions } from '@tanstack/react-query'
import { getMenu } from './lib/db/menus'

export const menuQueryOptions = (menuId: string) => queryOptions({
    queryKey: ['menus', menuId],
    queryFn: () => getMenu(menuId),
  })