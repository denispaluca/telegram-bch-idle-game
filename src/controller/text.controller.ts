import { Context } from "telegraf";
import { Message } from "typegram";
import {
    replyWithMenu
} from "../service/bot.service";
import { saveMessage } from "../service/message.service";
import { Text } from "../utils/text";

export async function defaultMessageHandler(ctx: Context) {
    const message = (ctx.message as Message.TextMessage).text;
    await saveMessage(ctx.from?.id, message);
    await replyWithMenu(ctx, Text.defaultMessageText);
}