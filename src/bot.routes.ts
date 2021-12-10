import { Telegraf } from "telegraf";
import * as CommandsController from "./controller/commands.controller";
import * as MenuController from "./controller/menu.controller";
import * as TextController from "./controller/text.controller";
import * as ActionsController from "./controller/actions.controller";
import { Actions, Menu } from "./service/bot.service";
import { getAllItems } from "./service/item.service";

export default async function botRoutes(bot: Telegraf) {
    bot.start(CommandsController.startHandler);
    bot.help(CommandsController.helpHandler);
    bot.command('menu', CommandsController.menuHandler);

    bot.hears(Menu.balance, MenuController.balanceHandler)
    bot.hears(Menu.shop, MenuController.shopHanlder);
    bot.hears(Menu.support, MenuController.supportHanlder);
    bot.hears(Menu.invite, MenuController.inviteHanlder);
    bot.hears(Menu.inventory, MenuController.inventoryHanlder);
    bot.hears(Menu.extra, MenuController.extraHanlder);
    bot.hears(Menu.exchange, MenuController.exchangeHandler);
    bot.hears(Menu.bonus, MenuController.bonusHanlder);
    bot.hears(Menu.add, MenuController.addHanlder);
    bot.hears(Menu.premium, MenuController.premiumHandler)

    bot.on('text', TextController.defaultMessageHandler);

    bot.action(Actions.showItems.toString(), ActionsController.showItemsHandler);
    bot.action(Actions.disableImages.toString(), ActionsController.disableImagesHandler);
    bot.action(Actions.getBonus.toString(), ActionsController.getBonusHandler);
    bot.action(Actions.collect.toString(), ActionsController.collectHandler);
    bot.action(Actions.exchange.toString(), ActionsController.exchangeActionHandler);
    bot.action(Actions.withdraw.toString(), ActionsController.withdrawActionHandler)

    //dynamically add item buy actions
    const items = await getAllItems();
    for (const item of items) {
        bot.action(item.itemId, ActionsController.buyHandler(item))
    }
}