import { Database, Statement } from 'bun:sqlite';

import type { Logger } from 'pino';
import type { JournalDBPort, NoteContent } from '../ports/JournalDBPort';

export class SQLiteJournalDBAdapter implements JournalDBPort {
    _db: Database;
    logger: Logger;
    constructor(databasePath: string, logger: Logger) {
        this.logger = logger;
        this._db = new Database(databasePath);

        [
            this._db.query('CREATE TABLE Chat(chat_id INTEGER PRIMARY KEY);'),
            this._db.query(
                'CREATE TABLE Category(category_id INTEGER PRIMARY KEY AUTOINCREMENT, chat_ref INTEGER, category_type VARCHAR(255), category_name VARCHAR(255));'
            ),
            this._db.query(
                'CREATE TABLE Note(note_id INTEGER PRIMARY KEY AUTOINCREMENT, category_ref INTEGER, note_type VARCHAR(255), note_content VARCHAR(255), recorded_date INTEGER);'
            )
        ].forEach((statement: Statement) => {
            statement.run();
            statement.finalize();
        });
    }

    createChat(chat_id: number): void {
        const query: Statement = this._db.query(
            'INSERT INTO Chat(chat_id) VALUES (?)'
        );
        query.run(chat_id);

        this.logger.info('Chat initialized');

        query.finalize();
    }
    createCategory(
        chat_ref: number,
        category: { name: string; type: string }
    ): void {
        const query: Statement = this._db.query(
            'INSERT INTO Category(chat_ref, category_type, category_name) VALUES (?, ?, ?)'
        );
        query.run(chat_ref, category.type, category.name);

        this.logger.info(
            `${category.type} category ${category.name} initialized`
        );

        query.finalize();
    }
    createNote(
        category_ref: number,
        note: { type: string; content: NoteContent; recordedDate: Date }
    ): void {
        const query: Statement = this._db.query(
            'INSERT INTO Note(category_ref, note_type, note_content, recorded_date) VALUES (?, ?, ?)'
        );
        query.run(category_ref, note.type, note.content, note.recordedDate);

        this.logger.info(`${note.type} note is initialized`);

        query.finalize();
    }
    close(): void {
        this._db.close();
    }
}
