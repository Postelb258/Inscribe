import type { Category } from '@core/interfaces/Category'
import type { Note } from '@core/interfaces/Note'

export interface RepositoryPort {
    createChat(chat_id: number): void

    createCategory(chat_ref: number, category: Category): void

    createNote(category_ref: number, note: Note): void

    close(): void
}
