export class Notifications {
  constructor(
    public id: number,
    public content: string | undefined,
    public date: Date | undefined,
    public nType: number | undefined,
    public isRead: boolean | undefined,
    public status: number | undefined,
    public guestId: number | undefined,
    public eventId: number | undefined, 
    public eventName?: string 
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

export enum NotificationStatus {
  Pending,
  Accepted,
  Rejected
}