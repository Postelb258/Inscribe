import type { Category } from '@core/interfaces/Category'
import type { Note } from '@core/interfaces/Note'
import type { RepositoryPost } from '@ports/RepositoryPort'

import { Database, Statement } from 'bun:sqlite'
import type { Logger } from 'pino'

export class SQLiteRepositoryAdapter implements RepositoryPost {
    logger: Logger
    repository: Database
    constructor(logger: Logger, repositoryPath: string) {
        this.logger = logger

        this.repository = new Database(repositoryPath)
        this.repository.exec('PRAGMA foreign_keys = ON;')

        const createQueries: Statement[] = [
            this.repository.query(
                'CREATE TABLE IF NOT EXISTS chat(chat_id INTEGER PRIMARY KEY);'
            ),
            this.repository.query(
                'CREATE TABLE IF NOT EXISTS category(category_id INTEGER PRIMARY KEY AUTOINCREMENT, \
            FOREIGN KEY (chat_ref) REFERENCES chat(chat_id), \
            category_name VARCHAR(255), \
            category_type VARCHAR(255));'
            ),
            this.repository.query(
                'CREATE TABLE IF NOT EXISTS note(note_id INTEGER PRIMARY KEY AUTOINCREMENT, \
             FOREIGN KEY (category_ref) REFERENCES category(category_id), \
             note_type VARCHAR(255), \
             note_content VARCHAR(255), \
             note_recorded_date INTEGER);'
            )
        ]

        createQueries.forEach((query: Statement) => {
            query.run()
            query.finalize()
        })

        this.logger.info('Tables initialized')
    }

    createChat(chat_id: number): void {
        const q: Statement = this.repository.query(
            'INSERT INTO TABLE chat(chat_id) VALUES (?)'
        )
        q.run(chat_id)

        this.logger.info(`Chat [chatId: ${chat_id}] created`)

        q.finalize()
    }
    createCategory(chat_ref: number, category: Category): void {
        const q: Statement = this.repository.query(
            'INSERT INTO TABLE category(chat_ref, category_name, category_type) VALUES (?, ?, ?)'
        )
        q.run(chat_ref, category.name, category.type)

        this.logger.info(
            `Category [type: ${category.type}; name: ${category.name}] created`
        )

        q.finalize()
    }
    createNote(category_ref: number, note: Note): void {
        const q: Statement = this.repository.query(
            'INSERT INTO TABLE note(category_ref, note_type, note_content, note_recorded_date) VALUES (?, ?, ?, ?)'
        )
        q.run(category_ref, note.type, note.noteContent, note.recordedDate)

        this.logger.info(
            `Note [type: ${note.type}] created at ${note.recordedDate}`
        )

        q.finalize()
    }
    close(): void {
        this.repository.close()
    }
}
