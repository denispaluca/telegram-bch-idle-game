import { Context } from "telegraf";
import { ItemDocument } from "../model/item.model";
import {
    replyWithMenu, showItems, editItemButtons
} from "../service/bot.service";
import { getAllItems } from "../service/item.service";
import { addRandomBonus, collect, findUser, toggleDisabledImages, exchange, buy } from "../service/user.service";
import { Text } from "../utils/text";
import { Constants } from "../utils/constants";
import { withdraw } from "../service/blockchain.service";

export async function showItemsHandler(ctx: Context) {
    const items = await getAllItems();
    const user = await findUser({ telegramId: ctx.from?.id });
    showItems(ctx, items, user?.disabledImages);
}

export async function disableImagesHandler(ctx: Context) {
    const disabled = await toggleDisabledImages(ctx.from?.id);
    await editItemButtons(ctx, disabled);
}

export async function getBonusHandler(ctx: Context) {
    try {
        const increase = await addRandomBonus(ctx.from?.id);
        await replyWithMenu(ctx, Text.bonusSuccess(increase));
    } catch (error) {
        await replyWithMenu(ctx, Text.bonusFailure);
    }
}

export async function collectHandler(ctx: Context) {
    const amount = await collect(ctx.from?.id);

    await replyWithMenu(ctx, Text.collectionSuccess(amount));
}

export async function exchangeActionHandler(ctx: Context) {
    const user = await findUser({ telegramId: ctx.from?.id });
    if (!user) return;

    if (user.balance.bch < Constants.minExchange) {
        await replyWithMenu(ctx, Text.exchangeFailure);
        return;
    }

    const amount = await exchange(user.telegramId);
    await replyWithMenu(ctx, Text.exchangeSuccess(amount));
}

export const buyHandler = (item: ItemDocument) => async (ctx: Context) => {
    const didBuy = await buy(item, ctx.from?.id);
    if (didBuy)
        await ctx.answerCbQuery(Text.buySuccess(item.displayName));
    else
        await ctx.answerCbQuery(Text.buyFailure)
}
export async function withdrawActionHandler(ctx: Context) {
    const user = await findUser({ telegramId: ctx.from?.id });
    if (!user) return;

    if(await withdraw(user))
        await replyWithMenu(ctx, Text.withdraw(user.balance.bch));
}