export class Guest{
    constructor(
        public id:number=0,
        public name:string| undefined = undefined,
        public invitationState:string| undefined = undefined,
        public email:string| undefined = undefined,
        public phone:string| undefined = undefined
    ){
   
    }
}

