
export class EmailRequest {
    public toEmail: string | undefined = undefined;
    public subject: string | undefined = undefined;
    public body: string | undefined = undefined;
    public eventName: string | undefined = undefined;
    public date: Date | undefined = undefined;
    public eventAddress: string | undefined = undefined;
    public eventImage: string | undefined=undefined;
    public guestId: number| undefined=0;
    public eventId: number| undefined=0;
}

