import type { Logger } from 'pino'
import type { InscribeContext } from './interfaces/InscribeContext'
import { Telegraf } from 'telegraf'
import type { Command } from './Command'
import type { HelpBuilder } from './HelpBuilder'

export class Bot {
    private bot: Telegraf<InscribeContext>
    private commands: Command<InscribeContext>[] = []
    constructor(logger: Logger, BOT_TOKEN?: string) {
        if (!BOT_TOKEN) logger.error('BOT_TOKEN must be provided')

        this.bot = new Telegraf<InscribeContext>(BOT_TOKEN!)
    }

    registerStartCommand(command: Command<InscribeContext>): Bot {
        this.commands.push(command)
        this.bot.start(command.handle)

        return this
    }

    registerCommand(command: Command<InscribeContext>): Bot {
        this.commands.push(command)
        this.bot.command(command.commandHelp.commandName, command.handle)

        return this
    }

    registerHelp(helpBuilder: HelpBuilder): Bot {
        this.commands.forEach((cmd: Command<InscribeContext>) => {
            helpBuilder.addHelpMessage(cmd.commandHelp)
        })

        this.bot.help((ctx: InscribeContext) =>
            ctx.reply(helpBuilder.constructHelp())
        )

        return this
    }

    run(): void {
        this.bot.launch()

        process.once('SIGINT', () => this.bot.stop('SIGINT'))
        process.once('SIGTERM', () => this.bot.stop('SIGTERM'))
    }
}
