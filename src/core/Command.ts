import type { Context } from 'telegraf'
import type { CommandHelp } from './HelpBuilder'

export abstract class Command<T extends Context> {
    private name: string
    private help: string
    private args?: string
    constructor(name: string, help: string, args?: string) {
        this.name = name
        this.help = help
        this.args = args
    }

    get commandHelp(): CommandHelp {
        return {
            commandName: this.name,
            commandHelp: this.help,
            commandArgs: this.args
        }
    }

    abstract handle(ctx: T): void
}
