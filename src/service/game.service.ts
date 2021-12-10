import { Game } from '../model/game.model';
import { Item } from '../model/item.model';
import { randomBetween } from '../utils/randomUtils';
import { checkBCHKeys } from './blockchain.service';
import { updateUserEarnings } from './user.service';


async function getGame() {
    let game = await Game.findOne();
    if (!game) {
        game = await Game.create({});
    }

    return game;
}

async function getTotalPlayers() {
    return Math.floor((await getGame()).totalPlayers);
}

async function getPlayers() {
    const totalPlayers = await getTotalPlayers();
    const online = totalPlayers; //TODO: Find way to record online players

    return [totalPlayers, online];
}

function startGame() {
    setInterval(async () => {
        const items = await Item.find();
        updateUserEarnings(items);
    }, 600000)

    setInterval(checkBCHKeys, 900000)
}


export { startGame, getTotalPlayers, getPlayers };