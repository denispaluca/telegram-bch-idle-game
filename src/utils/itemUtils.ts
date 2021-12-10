import { ItemDocument } from "../model/item.model";

function getItemName(items: ItemDocument[], itemId: string) {
    for (const item of items) {
        if (item.itemId === itemId) {
            return item.displayName;
        }
    }

    return '';
}

export { getItemName };