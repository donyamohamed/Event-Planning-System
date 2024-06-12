export class Expenses {
    constructor(
        public id: number = 0,
        public amount: number = 0,
        public name: string | undefined = undefined,
        public date: Date | undefined = new Date(),
        public userId: number | undefined = undefined,
        public eventId: number | undefined = undefined
    ) {}
}
