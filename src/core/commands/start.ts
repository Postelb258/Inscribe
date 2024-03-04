import { Command } from '@core/Command'
import type { RepositoryPort } from '@ports/RepositoryPort'
import type { Context } from 'telegraf'

export class StartCommand<T extends Context> extends Command<T> {
    repositoryAdapter: RepositoryPort
    constructor(
        repositoryAdapter: RepositoryPort,
        name: string,
        help: string,
        args?: string
    ) {
        super(name, help, args)

        this.repositoryAdapter = repositoryAdapter
    }
    handle(ctx: T): void {
        if (ctx.chat) this.repositoryAdapter.createChat(ctx.chat.id)
        ctx.reply(`🔐 Hello, Welcome to Inscribe, where you can keep your journal records confidentially! 📔✨

With this bot, you can securely keep track of various records and create personalized patterns for different types of entries. 📈✒️ Whether it's daily thoughts, goals, or important events 💼
        
It enables a series of features like:
    📅 Record keeping for events and dates
    📝 Journal entries for your thoughts and goals
    📊 Custom patterns for specific record types
    🧮 Calculations and insights based on your records
        
FAQ: @postelb
        `)
    }
}
