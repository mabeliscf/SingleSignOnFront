
import { UsersBasic } from "../UsersBasic";
import { Database } from "./Database";
import { Roles } from "./Roles";
import { UsersInfo } from "./UsersInfo";

export interface TenantInfo extends UsersBasic{

    roles : Roles[],
    database: Database[],
    users : UsersInfo[]


}