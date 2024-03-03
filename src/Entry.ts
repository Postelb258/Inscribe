import { pino, type Logger } from 'pino';
import { HelpBuilder } from './core/HelpBuilder';
import { Bot, type BotContext } from './core/Bot';
import { SQLiteJournalDBAdapter } from './adapters/SQLiteJournalDBAdapter';

const logger: Logger = pino();

const sqliteDBAdapter = new SQLiteJournalDBAdapter('journaldb.sqlite', logger);

const bot: Bot = new Bot(logger)
    .registerStartHandler((ctx: BotContext) => {
        if (ctx.chat) sqliteDBAdapter.createChat(ctx.chat.id);
    })
    .registerHelpHandler(
        new HelpBuilder()
            .addHelp('/start - starts an interaction')
            .addHelp('/help - displays a list of the available commands')
    )
    .run();
