export class Feedback{
    constructor(
        public id:number=0,
        public body:string| undefined = undefined,
        public rate:number| undefined = 0.0,
        public date: Date | undefined = undefined,)
        
        {
   
    }
}
