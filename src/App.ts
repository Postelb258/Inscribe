import { SQLiteRepositoryAdapter } from '@adapters/SQLiteRepositoryAdapter'
import { Bot } from '@core/Bot'
import { HelpBuilder } from '@core/HelpBuilder'
import { StartCommand } from '@core/commands/start'
import { pino, type Logger } from 'pino'

const logger: Logger = pino()

const repositoryAdapter = new SQLiteRepositoryAdapter(
    logger,
    'journalRepository.sqlite'
)

const bot = new Bot(logger, process.env.BOT_TOKEN)
    .registerStartCommand(
        new StartCommand(
            repositoryAdapter,
            'start',
            'Start interacting with bot'
        )
    )
    .registerHelp(new HelpBuilder())
    .run(() => repositoryAdapter.close())
