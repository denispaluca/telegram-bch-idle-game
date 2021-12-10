import { Message } from "../model/message.model";

async function saveMessage(telegramId?: number, message?: string) {
    if (!telegramId || !message) return;

    const exists = await Message.exists({ telegramId });
    if (!exists) {
        await Message.create({ telegramId });
    }

    await Message.updateOne({ telegramId }, { $push: { content: message } });
}

export { saveMessage };