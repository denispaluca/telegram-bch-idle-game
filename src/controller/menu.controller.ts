import { Context } from "telegraf";
import {
    replyWithMenu, replyToShop, showUserItems, balanceReply,
    extraReply, bonusReply, inviteReply, exchangeReply
} from "../service/bot.service";
import { getPlayers } from "../service/game.service";
import { getAllItems } from "../service/item.service";
import { findUser } from "../service/user.service";
import { convertAndGetRate, provideBCH } from "../service/blockchain.service";
import { Text } from "../utils/text";

export async function shopHanlder(ctx: Context) {
    const disabledImages = (await findUser({ telegramId: ctx.from?.id }))?.disabledImages;
    await replyToShop(ctx, disabledImages);
}

export async function inventoryHanlder(ctx: Context) {
    const items = await getAllItems();
    const user = await findUser({ telegramId: ctx.from?.id });
    if (user) {
        await showUserItems(ctx, items, user.items);
    }
}

export async function bonusHanlder(ctx: Context) {
    await bonusReply(ctx);
}

export async function addHanlder(ctx: Context) {
    const user = await findUser({ telegramId: ctx.from?.id });
    if (!user) return;

    const address = provideBCH(user.telegramId);
    await ctx.replyWithMarkdown(Text.deposit);
    await ctx.replyWithMarkdown(`*${await address}*`);
}

export async function inviteHanlder(ctx: Context) {
    const user = await findUser({ telegramId: ctx.from?.id });
    if (!user) return;

    await inviteReply(ctx, user.referrals);
}

export async function exchangeHandler(ctx: Context) {
    const user = await findUser({ telegramId: ctx.from?.id });
    if (!user) return;

    await exchangeReply(ctx, user.balance.bch);
}

export async function supportHanlder(ctx: Context) {
    await replyWithMenu(ctx, Text.support);
}


export async function balanceHandler(ctx: Context) {
    const user = await findUser({ telegramId: ctx.from?.id });
    if (!user) return;


    const { balance, referrals } = user;
    const { bch } = balance;
    const [usd, rate] = await convertAndGetRate(bch);
    await balanceReply(ctx, Text.balance(bch, usd, balance.gameCurrency, rate, referrals));
}


export async function extraHanlder(ctx: Context) {
    const [total, online] = await getPlayers();
    await extraReply(ctx, total, online);
}

export async function premiumHandler(ctx: Context) {
    await replyWithMenu(ctx, Text.premium());
}