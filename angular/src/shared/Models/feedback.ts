import { CurrentUser } from "./current-user";

export class Feedback{
    constructor(
        public body:string| undefined = undefined,
        public rate:number| undefined = 0.0,
        public dateTime: Date | undefined = undefined,
        public eventId:number,
        public userId:number,
        public user?: CurrentUser
    )
        
        {
   
    }
}