export class Notifications {
  constructor(
    public id: number,
    public content: string | undefined,
    public date: Date | undefined,
    public nType: number | undefined,
    public isRead: boolean | undefined,
    public isReviewTaken:boolean |undefined,
    public status: number | undefined,
    public guestId: number | undefined,
    public eventId: number | undefined, 
    public eventName?: string ,
    public startDate?: Date 
  ) { }
}
export class UpdateNotificationStatusDto {
  constructor(public id: number,
    public status: NotificationStatus) {  }
}
export class UpdateReminderStatusDto {
  constructor(public id: number,
    public isRead: boolean) {  }
}
export class UpdateReviewStatus{
  constructor(public id: number,
    public isReviewTaken: boolean) {  }
}

export enum NotificationStatus {
  Pending,
  Accepted,
  Rejected
}
