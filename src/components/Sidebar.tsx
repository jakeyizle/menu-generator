import { Link, } from '@tanstack/react-router'

import { BookOpen, ChefHat, Coffee, Home, PlusCircle, Search, Settings, UtensilsCrossed } from "lucide-react"
import { ScrollArea } from "./ScrollArea"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarRail,
} from "@/components/ui/sidebar"

export function MainSidebar() {
    return (
        <Sidebar>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link to="/">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                    <BookOpen className="size-4" />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-semibold">Recipe Manager</span>
                                    <span className="text-xs text-muted-foreground">Your digital cookbook</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <ScrollArea className="h-[calc(100vh-8rem)]">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link to="/"
                                    activeProps={{
                                        className: 'font-bold',
                                    }}
                                    activeOptions={{ exact: true }}>
                                    <Home className="mr-2 h-4 w-4" />
                                    <span>Dashboard</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>                        

                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link to="/recipes"                                           
                                           activeProps={{
                                             className: 'font-bold',
                                           }}
                                           >
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    <span>Manage Recipes</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link to="/menus"
                                    activeProps={{
                                        className: 'font-bold',
                                    }}  
                                    >
                                    <UtensilsCrossed className="mr-2 h-4 w-4" />
                                    <span>Manage Menus</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </ScrollArea>
            </SidebarContent>

            {/* <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href="/settings">
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Settings</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter> */}

            <SidebarRail />
        </Sidebar>
    )
}

