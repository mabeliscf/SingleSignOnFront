import { UsersBasic } from "../UsersBasic";
import { Database } from "./Database";
import { Roles } from "./Roles";

export interface UsersInfo extends UsersBasic{
    idTenantFather : number,
    roles: Roles[],
    databases: Database[]

}