
//keeps relationship between tenants and database, if no tenent found then the tenant does not have a DB assign
export interface dbAccess {
    idDbAccess : number,
    idTenant : number,
    idDB : number
   
}