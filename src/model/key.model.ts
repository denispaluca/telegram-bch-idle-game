import mongoose from 'mongoose';

interface KeyDocument extends mongoose.Document {
    telegramId: number;
    bch?: Address;
}

interface Address {
    privateKey: string;
    publicKey: string;
}

const AddressSchema = new mongoose.Schema({
    privateKey: { type: String, required: true },
    publicKey: { type: String, required: true }
});

const KeySchema = new mongoose.Schema(
    {
        telegramId: { type: Number, required: true },
        bch: { type: AddressSchema }
    }
)

const Key = mongoose.model<KeyDocument>('Key', KeySchema);

export { KeyDocument, Key, Address };