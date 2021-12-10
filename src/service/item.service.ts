import { Item } from "../model/item.model";


export async function getAllItems() {
    try {
        const items = await (Item.find().sort({ price: 1 }));
        return items;
    } catch (error) {
        const { message } = error as Error;
        throw new Error(message);
    }
}