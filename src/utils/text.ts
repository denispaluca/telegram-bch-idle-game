import { ItemDocument } from "../model/item.model";
import { Menu } from "../service/bot.service";
import { Constants } from "./constants";

export class Text {
    static inventoryBody = (total: number) => '';
    static itemString = ({ displayName, output, price }: ItemDocument) => '';
    static userItem = (name: string, amount: number, output: number) => '';
    static stats = (total: number, online: number) => '';
    static imageToggle = (disabled?: boolean) => '';
    static invite = (referrals: number) => '';
    static inviteLink = (bot: string, id?: number) => '';
    static exchange = (bch: number) => '';
    static exchangeSuccess = (amount: number) => '';
    static balance = (bch: number, usd: number, yld: number, bchUsd: number, referrals: number) => '';
    static premium = () => '';
    static withdraw = (bch: number) => '';
    static welcome = (name: string, totalPlayers: number, onlinePlayers: number) => '';
    static bonusSuccess = (bonus: number) => '';
    static buySuccess = (name: string) => '';
    static collectionSuccess = (amount: number) => '';
    
    static bonus: string;
    static deposit: string;
    static exchangeFailure: string;
    static support: string;
    static referralSuccess: string;
    static bonusFailure: string;
    static buyFailure: string;
    static menuMessage: string;
    static defaultMessageText: string;
    static noUserError: string;
    static defaultErrorMessage: string;
    static walletCreateError: string;
    static shopHeader: string;
    static shopText: string;
    static itemButton: string;
    static itemKeyboard: string;
    static inventoryHeader: string;
    static inventoryKeybord: string;
    static extraHeader: string;
    static bonusHeader: string;
    static bonusKeyboard: string;
    static inviteHeader: string;
    static exchangeHeader: string;
    static exchangeKeyboard: string;
    static balanceKeyboard: string;
}