export class Guest{
    constructor(
    
   
        public name:string| undefined = undefined,
        public invitationState:string| undefined = undefined,
        public email:string| undefined = undefined,
        public phone:string| undefined = undefined,
        public id?:number,
        public userId?:number,

        public eventId?:number

    ){
   
    }
}

