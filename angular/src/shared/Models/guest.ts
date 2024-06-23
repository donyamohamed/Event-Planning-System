export class Guest{
    constructor(
        public id:number=0,
        public name:string| undefined = undefined,
        public invitationState:string| undefined = "Pending",
        public email:string| undefined = undefined,
        public phone:string| undefined = undefined
    ){
   
    }
}

