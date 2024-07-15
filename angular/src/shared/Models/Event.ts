export enum Enumerator {
    Concert = "Concert",
    Conference = "Conference",
    Workshop = "Workshop",
    Seminar = "Seminar",
    Party = "Party",
    Exam = "Exam",
    Birthday = "Birthday",
    Graduation = "Graduation",
    Baby_Shower = "Baby Shower",
    Wedding = "Wedding",
    Gathering = "Gathering",
    Other = "Other"
}
export enum EventType {
    Paid = 0,
    Free = 1
}



export class Event {
    constructor(
        public id: number = 0,
        public isRead: boolean | undefined = false,
        public name: string | undefined = undefined,
        public description: string | undefined = undefined,
        public location: string | undefined = undefined,
        public startDate: Date | undefined = undefined,
        public endDate: Date | undefined = undefined,
        public isPublic: boolean | undefined = undefined,
        public maxCount: number | undefined = undefined,
        public eventImg: string | undefined = undefined,
        public eventImgFile: File | undefined | null = null,
        public category: string | undefined = undefined,
        public userId: number | undefined = undefined,
        public budgetId: number | undefined = undefined,
        public type: EventType = EventType.Free,
        public ticketPrice: number | undefined = undefined,
        public numberOfTickets :number |undefined =undefined,
        public source?: 'attending' | 'upcoming'
    ) {}
}
