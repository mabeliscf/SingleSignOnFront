//keep all logins available  per tenant
export interface TenantLogin{
    idTenantLogin: number,
    idTenant: number,
    passwordEncrypted : string ,
    loginType : number ,
    administrator : boolean,
    tenantFather : number
}