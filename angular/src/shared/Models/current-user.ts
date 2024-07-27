export class CurrentUser {
  constructor(
   public id: number,
   public name: string | undefined,
   public surname: string | undefined,
   public  userName: string | undefined,
   public  emailAddress: string | undefined,
   public age: number | undefined,
   public genderUser: string | undefined,
   public  image: string | undefined,
   public  ImagePath :File|undefined,
   public roleNames: string[]
  ) {}
}
