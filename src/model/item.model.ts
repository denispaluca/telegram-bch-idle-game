import mongoose from 'mongoose';

interface ItemDocument extends mongoose.Document {
    itemId: string;
    price: number;
    output: number;
    displayName: string;
    imageUrl?: string;
}

const ItemSchema = new mongoose.Schema(
    {
        itemId: { type: String, required: true, unique: true },
        price: { type: Number, required: true },
        output: { type: Number, required: true },
        displayName: { type: String, required: true },
        imageUrl: { type: String }
    }
)

const Item = mongoose.model<ItemDocument>('Item', ItemSchema);

export { ItemDocument, Item };