export interface NoteContent {}

export interface JournalDBPort {
    createChat(chat_id: number): void;
    createCategory(
        chat_ref: number,
        category: {
            name: string;
            type: string;
        }
    ): void;
    createNote(
        category_ref: number,
        note: {
            type: string;
            content: NoteContent;
            recordedDate: Date;
        }
    ): void;
    close(): void;
}
