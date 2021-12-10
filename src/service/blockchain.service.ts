import { Wallet, Mainnet, SendRequest, UnitEnum } from 'mainnet-js';
import { Address, Key } from '../model/key.model';
import { addCurrency } from './user.service';
import { Text } from '../utils/text';
import log from '../logger';
import { UserDocument } from '../model/user.model';
import { LeanDocument } from 'mongoose';

async function createBCHKeys(): Promise<Address> {
    let wallet = await Wallet.newRandom();
    let tries = 0;
    while (!wallet.address || !wallet.privateKeyWif) {
        if (tries == 10) throw new Error(Text.walletCreateError);
        wallet = await Wallet.newRandom();
        tries++;
    }

    return {
        publicKey: wallet.address,
        privateKey: wallet.privateKeyWif
    }
}

export async function provideBCH(telegramId: number): Promise<string> {
    let key = await Key.findOne({ telegramId });
    if (!key) {
        key = await Key.create({
            telegramId,
            bch: await createBCHKeys()
        })
    }

    if (!key.bch) {
        key.bch = await createBCHKeys();
        await key.save();
    }

    return key.bch.publicKey;
}

export async function checkBCHKeys() {
    const keys = await Key.find();
    const mainBCHAddress = process.env.BCH_ADDRESS || '';

    const promises = keys.map(async key => {
        try {
            if (!key.bch) {
                return;
            }

            const wallet = await Wallet.fromWIF(key.bch.privateKey);
            const balance = await wallet.getBalance();

            const bch = typeof balance === 'number' ? balance : (balance.bch || 0);
            if (bch === 0) {
                return;
            }

            await wallet.sendMax(mainBCHAddress);
            await addCurrency(bch, key.telegramId);

            return Promise.resolve();
        } catch (e) {
            log.error(e as Error);
        }
    });

    await Promise.all(promises);
}

export async function withdraw(user: LeanDocument<UserDocument>): Promise<boolean> {
    const key = await Key.findOne({ telegramId: user.telegramId });
    if(!key || !key.bch) return false;
    const mainBCHAddress = process.env.BCH_ADDRESS || '';

    try {
        const wallet = await Wallet.fromWIF(mainBCHAddress);

        await wallet.send(new SendRequest({
            cashaddr: key.bch.publicKey,
            value: user.balance.bch,
            unit: UnitEnum.BCH
        }));

        return true;
    } catch (e) {
        log.error(e as Error);
        return false;
    }
    return false;
}

export async function convertAndGetRate(bch: number): Promise<[number, number]> {
    const rate = await Mainnet.convert(1, 'bch', 'usd');
    return [rate * bch, rate];
}