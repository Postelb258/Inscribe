import type { Category } from '@core/interfaces/Category'
import type { Note } from '@core/interfaces/Note'
import type { RepositoryPort } from '@ports/RepositoryPort'

import { Database, Statement } from 'bun:sqlite'
import type { Logger } from 'pino'

type DataTypes = 'chat' | 'category' | 'note'

export class SQLiteRepositoryAdapter implements RepositoryPort {
    logger: Logger
    repository: Database

    createQueries: Record<DataTypes, Statement>
    constructor(logger: Logger, repositoryPath: string) {
        this.logger = logger

        this.repository = new Database(repositoryPath)
        this.repository.exec('PRAGMA foreign_keys = ON;')
        this.repository.exec('PRAGMA journal_mode = WAL;')

        const initQueries: Statement[] = [
            this.repository.query(
                'CREATE TABLE IF NOT EXISTS chat(chat_id INTEGER PRIMARY KEY);'
            ),
            this.repository.query(
                'CREATE TABLE IF NOT EXISTS category( \
                    category_id INTEGER PRIMARY KEY AUTOINCREMENT, \
                    chat_ref INTEGER, \
                    category_name TEXT, \
                    category_type TEXT, \
                    FOREIGN KEY (chat_ref) REFERENCES chat(chat_id) \
                );'
            ),
            this.repository.query(
                'CREATE TABLE IF NOT EXISTS note(note_id INTEGER PRIMARY KEY AUTOINCREMENT, \
                  category_ref INTEGER,  \
             note_type TEXT, \
             note_content TEXT, \
             note_recorded_date INTEGER, \
             FOREIGN KEY (category_ref) REFERENCES category(category_id));'
            )
        ]

        initQueries.forEach((query: Statement) => {
            query.run()
            query.finalize()
        })

        this.logger.info('Tables initialized')

        this.createQueries = {
            chat: this.repository.query(
                'INSERT INTO chat(chat_id) VALUES (?1)'
            ),
            category: this.repository.query(
                'INSERT INTO category(chat_ref, category_name, category_type) VALUES (?1, ?2, ?3)'
            ),
            note: this.repository.query(
                'INSERT INTO note(category_ref, note_type, note_content, note_recorded_date) VALUES (?1, ?2, ?3, ?4)'
            )
        }

        this.logger.info('Queries are constructed')
    }

    createChat(chat_id: number): void {
        this.createQueries.chat.run(chat_id)

        this.logger.info(`Chat [chatId: ${chat_id}] created`)
    }
    createCategory(chat_ref: number, category: Category): void {
        this.createQueries.category.run(chat_ref, category.name, category.type)

        this.logger.info(
            `Category [type: ${category.type}; name: ${category.name}] created`
        )
    }
    createNote(category_ref: number, note: Note): void {
        this.createQueries.note.run(
            category_ref,
            note.type,
            note.noteContent,
            note.recordedDate
        )

        this.logger.info(
            `Note [type: ${note.type}] created at ${note.recordedDate}`
        )
    }
    close(): void {
        this.repository.close()
    }
}
