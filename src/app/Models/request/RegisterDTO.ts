export interface RegisterDTO{
    id:number,
    firstName: string ,
    lastname: string,
    username: string,
    phone: string,
    email: string,
    password: string,
    logintype : number,
    isAdmin :boolean,
    isTenant :boolean,
    isUser :boolean,
}