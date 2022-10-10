import { DbAccess } from "../DbAccess";
import { Tenant } from "../Tenant";
import { TenantLogin } from "../TenantLogin";
import { TenantRole } from "../TenantRole";

export interface updateUserDTO  {
    idTenant : number,
    fullName : String,
    email : String ,
    phone : string,
    username: string,

    password : string ,
    loginType : number ,
    administrator : boolean,
    tenantFather : number

    role: TenantRole[],
    removeRole: TenantRole[],

    removeDatabase : DbAccess[],
    database : DbAccess[],

}