export enum Enumerator {
    Concert = "Concert",
    Conference = "Conference",
    Workshop = "Workshop",
    Seminar = "Seminar",
    Party = "Party",
    Exam = "Exam",
    Birthday = "Birthday",
    Graduation = "Graduation",
    Baby_Shower = "Baby_Shower",
    Wedding = "Wedding",
    Gathering = "Gathering",
    Other = "Other"
}

export class Event {
    constructor(
        public id: number = 0,
        public name: string | undefined = undefined,
        public description: string | undefined = undefined,
        public location: string | undefined = undefined,
        public startDate: Date | undefined = undefined,
        public endDate: Date | undefined = undefined,
        public isPublic: boolean | undefined = undefined,
        public maxCount: number | undefined = undefined,
        public eventImg: string | undefined = undefined,
        public eventImgFile: File | null = null, 
        public category: string | undefined = undefined,
        public userId: number | undefined = undefined,
        public budgetId: number | undefined = undefined
    ) {}
}