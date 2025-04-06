import { Menu } from "@/types/types";
import localForage from "localforage";
import { v4 as uuidv4 } from 'uuid';

export class MenuNotFoundError extends Error { }

const db = localForage.createInstance({
    name: "menus",
    storeName: "menus",
});

export const getMenus = async (): Promise<Menu[]> => {
    const menus: Menu[] = []
    await db.iterate((menu: Menu) => { 
        menus.push(menu) })
    return menus;
};

export const getMenu = async (id: string): Promise<Menu> => {
    const menu = await db.getItem<Menu>(id)
    if (!menu) throw new MenuNotFoundError(`Menu with id ${id} not found`)
    return menu;
};

export const createMenu = async (menu: Menu): Promise<Menu> => {
    menu.id ||= uuidv4()
    menu.createdAt ||= new Date().toISOString()
    if (await doesMenuExist(menu.id)) {
        throw new Error(`Menu with id ${menu.id} already exists`)
    }

    await db.setItem(menu.id, menu)
    return menu;
};

export const updateMenu = async (menu: Menu): Promise<Menu> => {
    await db.setItem(menu.id, menu)
    return menu;
};

export const deleteMenu = async (id: string): Promise<void> => {
    await db.removeItem(id)
};

export const doesMenuExist = async (id: string): Promise<boolean> => {
    const menu = await db.getItem<Menu>(id)
    return !!menu
};