export enum Enumerator {
    Done = "Done",
    Todo = "Todo",
    InProgress = "InProgress"
}

export class ToDoList {
    constructor(
        public id: number = 0,
        public status: string | undefined = undefined,
        public description: string | undefined = undefined,
        public date: Date | undefined = undefined,
        public userId: number | undefined = undefined,
        public eventId: number | undefined = undefined
    ) {}
}


















