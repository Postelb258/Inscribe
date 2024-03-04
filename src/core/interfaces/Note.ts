type NoteContent = string

export interface Note {
    type: string
    noteContent: NoteContent
    recordedDate: Date
}
