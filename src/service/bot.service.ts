import { Context } from "telegraf";
import { InlineKeyboardButton, KeyboardButton } from "typegram";
import { ItemDocument } from "../model/item.model";
import { UserItem } from "../model/user.model";
import { getItemName } from "../utils/itemUtils";
import { Text } from "../utils/text";

interface LinkMessage {
    message: string;
    url: string;
    linkText: string;
}

enum Menu {
    balance = 'Balance',
    shop = 'Shop',
    inventory = 'Inventory',
    exchange = 'Exchange',
    invite = 'Invite friends',
    add = 'Add',
    bonus = 'Bonus',
    support = 'Support',
    extra = 'Extra',
    premium = 'Premium'
}

enum Actions {
    showItems,
    disableImages,
    getBonus,
    collect,
    exchange,
    withdraw
}

const keyboard: KeyboardButton[][] = [
    [Menu.balance],
    [Menu.shop, Menu.inventory, Menu.exchange],
    [Menu.invite, Menu.add],
    [Menu.bonus, Menu.support, Menu.extra],
    [Menu.premium]
];

function replyWithMenu(ctx: Context, message: string) {
    return ctx.replyWithMarkdown(message, {
        reply_markup: {
            keyboard
        }
    })
}

function replyWithLink(ctx: Context, content: LinkMessage) {
    const { message, url, linkText } = content;

    ctx.replyWithMarkdown(message, {
        reply_markup: {
            inline_keyboard: [
                [{ url, text: linkText }]
            ]
        }
    });
}

async function replyToShop(ctx: Context, disabledImages?: boolean) {
    await ctx.replyWithMarkdown(Text.shopHeader);

    const itemButtons = createItemButtons(disabledImages);

    await ctx.replyWithMarkdown(Text.shopText, {
        reply_markup: {
            inline_keyboard: itemButtons
        }
    });
}

function editItemButtons(ctx: Context, disabledImages?: boolean) {
    return ctx.editMessageReplyMarkup({
        inline_keyboard: createItemButtons(disabledImages)
    });
}



function createItemButtons(disabledImages: boolean | undefined) {
    const itemListButton: InlineKeyboardButton.CallbackButton = {
        callback_data: Actions.showItems.toString(),
        text: Text.itemButton
    };

    const disableImagesButton: InlineKeyboardButton.CallbackButton = {
        callback_data: Actions.disableImages.toString(),
        text: Text.imageToggle(disabledImages)
    };
    return [
        [itemListButton],
        [disableImagesButton]
    ];
}

async function showItems(ctx: Context, items: ItemDocument[], disabledImages?: boolean) {
    for (const item of items) {
        if (!disabledImages && item.imageUrl) {
            await ctx.replyWithPhoto(item.imageUrl);
        }
        await ctx.replyWithMarkdown(Text.itemString(item), {
            reply_markup: {
                inline_keyboard: [[{
                    callback_data: item.itemId,
                    text: Text.itemKeyboard
                }]]
            }
        });
    }
}

async function showUserItems(ctx: Context, items: ItemDocument[], userItems: UserItem[]) {
    await ctx.replyWithMarkdown(Text.inventoryHeader);
    let replyString = userItems
        .map(({ itemId, amount, output }) => Text.userItem(
            getItemName(items, itemId),
            amount,
            output
        ))
        .join('\n\n');

    const total = userItems.reduce((sum, item) => sum + item.output, 0);
    replyString += Text.inventoryBody(total);
    await ctx.replyWithMarkdown(replyString, {
        reply_markup: {
            inline_keyboard: [[{
                callback_data: Actions.collect.toString(),
                text: Text.inventoryKeybord
            }]]
        }
    });
}

async function extraReply(ctx: Context, totalPlayers: number, onlinePlayers: number) {
    await ctx.replyWithMarkdown(Text.extraHeader);
    await replyWithMenu(ctx, Text.stats(totalPlayers, onlinePlayers));
}

async function bonusReply(ctx: Context) {
    await ctx.replyWithMarkdown(Text.bonusHeader);
    await ctx.replyWithMarkdown(Text.bonus,
        {
            reply_markup: {
                inline_keyboard: [[{
                    callback_data: Actions.getBonus.toString(),
                    text: Text.bonusKeyboard
                }]]
            }
        });
}

async function inviteReply(ctx: Context, referrals: number) {
    await ctx.replyWithMarkdownV2(Text.inviteHeader);
    await ctx.replyWithMarkdown(Text.invite(referrals));
    await replyWithMenu(ctx, Text.inviteLink(ctx.botInfo.username, ctx.from?.id));
}

async function exchangeReply(ctx: Context, bch: number) {
    await ctx.replyWithMarkdownV2(Text.exchangeHeader);
    await ctx.replyWithMarkdown(Text.exchange(bch),
        {
            reply_markup: {
                inline_keyboard: [[{
                    callback_data: Actions.exchange.toString(),
                    text: Text.exchangeKeyboard
                }]]
            }
        });
}

function balanceReply(ctx: Context, text: string) {
    return ctx.replyWithMarkdown(text, {
        reply_markup: {
            inline_keyboard: [[{
                callback_data: Actions.withdraw.toString(),
                text: Text.balanceKeyboard
            }]]
        }
    })
}

export {
    replyWithMenu, replyWithLink, replyToShop, extraReply,
    showUserItems, showItems, editItemButtons, Menu, Actions,
    bonusReply, inviteReply, exchangeReply, balanceReply
};