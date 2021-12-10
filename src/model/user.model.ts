import mongoose from "mongoose";

export interface UserDocument extends mongoose.Document {
    telegramId: number;
    items: UserItem[];
    lastBonus: Date;
    disabledImages?: boolean;
    referrals: number;
    balance: Balance;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserItem {
    itemId: string;
    amount: number;
    output: number;
}

const ItemSchema = new mongoose.Schema({
    itemId: { type: String, required: true },
    amount: { type: Number, required: true },
    output: { type: Number, required: true }
})

interface Balance {
    gameCurrency: number;
    bch: number;
}

const BalanceSchema = new mongoose.Schema({
    gameCurrency: { type: Number, required: true, default: 0 },
    bch: { type: Number, required: true, default: 0 },
})

const UserSchema = new mongoose.Schema(
    {
        telegramId: { type: Number, required: true, unique: true },
        items: { type: [ItemSchema], required: true },
        balance: {
            type: BalanceSchema, required: true,
            default: {
                gameCurrency: 250,
                bch: 0
            }
        },
        referrals: { type: Number, required: true, default: 0 },
        lastBonus: { type: Date },
        disabledImages: { type: Boolean }
    },
    { timestamps: true }
);

const User = mongoose.model<UserDocument>("User", UserSchema);

export default User;