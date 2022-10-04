//keep all logins available  per tenant
export interface TenantLogin{
    idTenantLogin: number,
    idTenant: number,
    username : string ,
    passwordEncrypted : string ,
    loginType : string ,
    token : string
}