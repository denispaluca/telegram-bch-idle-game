import { Context, Middleware } from "telegraf";
import logger from "../logger";
import { UserItem } from "../model/user.model";
import { getAllItems } from "../service/item.service";
import { addReferral, createUser, findUser } from "../service/user.service";
import { Text } from '../utils/text';

export const requireUser: Middleware<Context> = async (ctx, next) => {
    try {
        const { from } = ctx;
        if (!from) {
            logger.error(ctx, Text.noUserError);
            return;
        }
        const telegramId = from.id;

        const data: any = {
            telegramId
        }
        let user = await findUser(data);
        if (user) {
            await next();
            return;
        }
        const items = await getAllItems();
        data.items = items.map(({ itemId }): UserItem => ({
            itemId,
            amount: 0,
            output: 0
        }));
        user = await createUser(data);

        const { message } = ctx;
        if (!message) return;

        const text: string = (message as any).text;
        const startPayload = Number(text.replace('/start ', ''));
        if (startPayload) {
            await addReferral(ctx, telegramId, startPayload);
        }

        await next();
    } catch (e) {
        logger.error(e as Error);
        ctx.reply(Text.defaultErrorMessage)
            .catch();
    }
}