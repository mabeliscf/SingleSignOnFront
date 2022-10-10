export interface RegisterDTO{
    username: string,
    fullname: string,
    phone: string,
    email: string,
    password: string,
    logintype : number,
    isAdmin :boolean,
    isTenant :boolean,
    isUser :boolean,
}