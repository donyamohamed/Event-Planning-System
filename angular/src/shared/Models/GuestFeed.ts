export class GuestFeedback {
        constructor(
                public body: string | undefined = undefined,
                public rate: number | undefined = 0.0,
                public dateTime: Date | undefined = undefined,
                public eventId: number,
                public guestId: number
        ) {

        }
}