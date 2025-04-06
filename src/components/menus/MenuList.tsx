import { useState } from "react"
import { Link } from '@tanstack/react-router'
import { Edit, Trash2, Calendar } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DeleteDialog } from "../DeleteDialog"
import { formatDistanceToNow } from "date-fns"
import { Menu } from "@/types/types"
import { deleteMenu } from "@/lib/db/menus"

export function MenuList({ menus }: { menus: Menu[] }) {
    const [searchTerm, setSearchTerm] = useState("")
    const [daysFilter, setDaysFilter] = useState("all")
    const [menuToDelete, setMenuToDelete] = useState<string | null>(null)

    const filteredMenus = menus.filter((menu) => {
        const matchesSearch =
            menu.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (menu.description && menu.description.toLowerCase().includes(searchTerm.toLowerCase()))
        const matchesDays = daysFilter === "all" || menu.numberOfDays.toString() === daysFilter
        return matchesSearch && matchesDays
    })

    const handleDelete = () => {
        if (menuToDelete) {
            deleteMenu(menuToDelete)
        }
        setMenuToDelete(null)
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <Input
                        placeholder="Search menus..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                    />
                </div>
                <div className="w-full sm:w-48">
                    <Select value={daysFilter} onValueChange={setDaysFilter}>
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by days" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Days</SelectItem>
                            <SelectItem value="1">1 Day</SelectItem>
                            <SelectItem value="2">2 Days</SelectItem>
                            <SelectItem value="3">3 Days</SelectItem>
                            <SelectItem value="4">4 Days</SelectItem>
                            <SelectItem value="5">5 Days</SelectItem>
                            <SelectItem value="6">6 Days</SelectItem>
                            <SelectItem value="7">7 Days</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {filteredMenus.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-muted-foreground">No menus found. Try a different search or create a new menu.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMenus.map((menu) => (
                        <Card key={menu.id} className="overflow-hidden">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-xl">{menu.name}</CardTitle>
                                <div className="text-sm text-muted-foreground">
                                    Created {formatDistanceToNow(new Date(menu.createdAt), { addSuffix: true })}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground line-clamp-2 mb-4">
                                    {menu.description || `A ${menu.numberOfDays}-day meal plan`}
                                </p>
                                <div className="flex items-center gap-2 text-sm">
                                    <Calendar className="h-4 w-4" />
                                    <span>
                                        {menu.numberOfDays} {menu.numberOfDays === 1 ? "day" : "days"} •{" "}
                                        {menu.days.reduce((total, day) => total + day.meals.length, 0)} meals
                                    </span>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between border-t pt-4">
                                <Link to={'/menus/$menuId'}
                                    params={{
                                        menuId: menu.id
                                    }}>
                                    <Button variant="outline" size="sm">
                                        View Menu
                                    </Button>
                                </Link>
                                <div className="flex gap-2">
                                <Link to={'/menus/$menuId/edit'}
                                    params={{
                                        menuId: menu.id
                                    }}>
                                        <Button variant="ghost" size="icon">
                                            <Edit className="h-4 w-4" />
                                            <span className="sr-only">Edit</span>
                                        </Button>
                                    </Link>
                                    <Button variant="ghost" size="icon" onClick={() => setMenuToDelete(menu.id)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                        <span className="sr-only">Delete</span>
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}

            <DeleteDialog isOpen={!!menuToDelete} onClose={() => setMenuToDelete(null)} onDelete={handleDelete} />
        </div>
    )
}

