import type { Logger } from 'pino';
import { Context, Telegraf, type Middleware } from 'telegraf';
import type { HelpBuilder } from './HelpBuilder';

export interface BotContext extends Context {}

export class Bot {
    private _bot: Telegraf<BotContext>;
    constructor(logger: Logger) {
        if (!process.env.BOT_TOKEN) logger.error('BOT_TOKEN must be provided');

        // TypeScript does not recognize check of (!process.env.BOT_TOKEN) so ! at the end is required.
        this._bot = new Telegraf<BotContext>(process.env.BOT_TOKEN!);
    }
    // initHandler is impostor o_0 (no Middleware)
    registerStartHandler(initHandler: (ctx: BotContext) => void): Bot {
        this._bot.start((ctx: BotContext) => {
            initHandler(ctx);
            ctx.reply(
                `
            🔐 Hello, Welcome to Inscribe, where you can keep your journal records confidentially! 📔✨

With this bot, you can securely keep track of various records and create personalized patterns for different types of entries. 📈✒️ Whether it's daily thoughts, goals, or important events 💼

It enables a series of features like:
📅 Record keeping for events and dates
📝 Journal entries for your thoughts and goals
📊 Custom patterns for specific record types
🧮 Calculations and insights based on your records

FAQ -> @postelb
`
            );
        });

        return this;
    }

    registerHelpHandler(helpBuilder: HelpBuilder): Bot {
        this._bot.help((ctx: BotContext) => ctx.reply(helpBuilder.help));

        return this;
    }

    registerCommandHandler(
        command: string,
        handler: Middleware<BotContext>
    ): Bot {
        this._bot.command(command, handler);

        return this;
    }

    run(): Bot {
        this._bot.launch();

        process.once('SIGINT', () => this._bot.stop('SIGINT'));
        process.once('SIGTERM', () => this._bot.stop('SIGTERM'));

        return this;
    }
}
