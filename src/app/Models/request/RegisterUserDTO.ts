import { DbAccess } from "../DbAccess";
import { Roles } from "../response/Roles";
import { TenantRole } from "../TenantRole";
import { RegisterDTO } from "./RegisterDTO";

export interface RegisterUserDTO extends RegisterDTO{
    databases : DbAccess[],
    roles : TenantRole[],
    idTenantFather: number
}