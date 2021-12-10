import express from 'express';
import log from './logger';
import { Telegraf } from 'telegraf';
import connect from './db/connect';
import routes from './routes';
import botRoutes from './bot.routes';
import { requireUser } from './middleware/requireUser';
import { startGame } from './service/game.service';

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const { PORT, HOST, DB_URI, SERVER_URL, BOT_TOKEN } = process.env;

const bot = new Telegraf(String(BOT_TOKEN))
bot.use(requireUser);

const secretPath = `/telegraf/${bot.secretPathComponent()}`

// Set telegram webhook
// npm install -g localtunnel && lt --port 3000
bot.telegram.setWebhook(`${SERVER_URL}${secretPath}`)

const app = express()
app.get('/', (req, res) => res.send('Healthcheck'))
// Set the bot API endpoint
app.use(bot.webhookCallback(secretPath))
app.listen(Number(PORT), HOST || '0.0.0.0', () => {
    log.info('Server listning on port: ' + PORT);

    connect(String(DB_URI));

    startGame();
    // Set the bot response
    botRoutes(bot);

    routes(app);
})