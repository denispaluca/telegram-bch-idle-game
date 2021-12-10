import { Context } from "telegraf";
import {
    replyWithMenu
} from "../service/bot.service";
import { getPlayers } from "../service/game.service";
import { Text } from "../utils/text";

export async function startHandler(ctx: Context) {
    const [total, online] = await getPlayers();
    await replyWithMenu(ctx,
        Text.welcome(
            ctx.botInfo.first_name,
            total,
            online
        )
    );
}

export async function helpHandler(ctx: Context) {
    await replyWithMenu(ctx, Text.support);
}

export async function menuHandler(ctx: Context) {
    await replyWithMenu(ctx, Text.menuMessage);
}