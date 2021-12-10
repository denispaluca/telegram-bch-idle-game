import { DocumentDefinition, FilterQuery } from "mongoose";
import { ItemDocument } from "../model/item.model";
import User, { UserDocument } from "../model/user.model";
import { Constants } from "../utils/constants";
import { randomBetween } from "../utils/randomUtils";
import { isOlderThan } from "../utils/timeUtils";
import { Context } from 'telegraf';
import { Text } from '../utils/text';

async function createUser(input: DocumentDefinition<UserDocument>) {
    try {
        return await User.create(input);
    } catch (error) {
        const { message } = error as Error;
        throw new Error(message);
    }
}

async function findUser(query: FilterQuery<UserDocument>) {
    return User.findOne(query).lean();
}

async function addRandomBonus(telegramId?: number) {
    const rand = randomBetween(10, 100);
    const user = await User.findOne({ telegramId });
    if (!user || (user.lastBonus && !isOlderThan(user.lastBonus, 300))) {
        throw Error;
    }

    user.balance.gameCurrency += rand;
    user.lastBonus = new Date();
    await user.save();

    return rand;
}

async function toggleDisabledImages(telegramId?: number) {
    const user = await User.findOne({ telegramId });
    if (user) {
        user.disabledImages = !user.disabledImages;
        await user.save();
        return user.disabledImages;
    }
}

async function addReferral(ctx: Context, telegramId?: number, referralId?: number) {
    if (referralId == telegramId)
        return;

    const user = await User.findOne({ telegramId: referralId });
    if (!user) return;

    user.referrals++;
    user.balance.gameCurrency += 100;

    await user.save();
    await ctx.telegram.sendMessage(user.telegramId, Text.referralSuccess, {
        parse_mode: 'Markdown'
    });
}

async function updateUserEarnings(items: ItemDocument[]) {
    let itemOutput: Record<string, number> = {};
    for (const item of items) {
        itemOutput[item.itemId] = item.output / 6;
    }

    const users = await User.find();
    for (const user of users) {
        for (const item of user.items) {
            item.output += item.amount * itemOutput[item.itemId];
        }
    }

    await User.bulkSave(users);
}

async function collect(telegramId?: number): Promise<number> {
    const user = await User.findOne({ telegramId });
    if (!user) return 0;

    let total = 0;

    for (const item of user.items) {
        total += item.output;
        item.output = 0;
    }

    user.balance.bch += total;
    await user.save();
    return total;
}

async function exchange(telegramId: number): Promise<number> {
    const user = await User.findOne({ telegramId });
    if (!user) return 0;

    const amount = Math.floor(user.balance.bch / Constants.minExchange);

    user.balance.gameCurrency += amount;
    user.balance.bch -= amount * Constants.minExchange;

    await user.save();
    return amount;
}

async function buy(item: ItemDocument, telegramId?: number): Promise<boolean> {
    const user = await User.findOne({ telegramId });
    if (!user || user.balance.gameCurrency < item.price)
        return false;

    user.balance.gameCurrency -= item.price;
    for (const userItem of user.items) {
        if (userItem.itemId !== item.itemId)
            continue;

        userItem.amount++;
        break;
    }

    await user.save();
    return true;
}

async function addCurrency(bch: number, telegramId: number) {
    const yld = Math.floor(bch * 1.3 / Constants.minExchange);
    await User.updateOne({ telegramId }, {
        $inc: {
            'balance.gameCurrency': yld
        }
    });
}



export {
    createUser, findUser, toggleDisabledImages,
    addRandomBonus, addReferral, updateUserEarnings,
    collect, exchange, buy, addCurrency
};