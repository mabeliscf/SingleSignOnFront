import { Roles } from "../Models/response/Roles";
import { TenantInfo } from "../Models/response/TenantInfo";


  export const TENANTINFOTEST: TenantInfo[] = [
    {
        id: 1,
        fullname : "fullname" ,
        email: "email" ,
        phone: "8293550691" ,
        username: "string" ,
        isAdmin: false ,
        
        roles : [
            {
                idRole : 1,
                roleDescription: "tenant",
                roleFather : 0
            },
            {
                idRole : 2,
                roleDescription: "user",
                roleFather : 0
            },
        ],
        database: [
            {
                idDb : 1,
                dbSchema : "dbSchematest1",
                dbName : "dbNametest1",
                serverName : "serverNametest1",
                serverRoute : "serverRoutetest1",
            }      
        ],
        users : [
            {
                id: 2,
                fullname : "string" ,
                email: "string" ,
                phone: "8293550691" ,
                username: "string" ,
                isAdmin: false ,

                idTenantFather : 1,
                roles : [
                    {
                        idRole : 1,
                        roleDescription: "tenant",
                        roleFather : 0
                    },
                    {
                        idRole : 2,
                        roleDescription: "user",
                        roleFather : 0
                    },
                ],
                databases: [
                    {
                        idDb : 1,
                        dbSchema : "dbSchematest1",
                        dbName : "dbNametest1",
                        serverName : "serverNametest1",
                        serverRoute : "serverRoutetest1",
                    }
                ]
            }
        ],
    }, 
    {
        id: 3,
        fullname : "fullname3" ,
        email: "email" ,
        phone: "8293550691" ,
        username: "string" ,
        isAdmin: false ,
        
        roles : [
            {
                idRole : 1,
                roleDescription: "tenant",
                roleFather : 0
            },
            {
                idRole : 2,
                roleDescription: "user",
                roleFather : 0
            },
        ],
        database: [
            {
                idDb : 1,
                dbSchema : "dbSchematest1",
                dbName : "dbNametest1",
                serverName : "serverNametest1",
                serverRoute : "serverRoutetest1",
            }      
        ],
        users : [
            {
                id: 2,
                fullname : "string" ,
                email: "string" ,
                phone: "8293550691" ,
                username: "string" ,
                isAdmin: false ,

                idTenantFather : 1,
                roles : [
                    {
                        idRole : 1,
                        roleDescription: "tenant",
                        roleFather : 0
                    },
                    {
                        idRole : 2,
                        roleDescription: "user",
                        roleFather : 0
                    },
                ],
                databases: [
                    {
                        idDb : 1,
                        dbSchema : "dbSchematest1",
                        dbName : "dbNametest1",
                        serverName : "serverNametest1",
                        serverRoute : "serverRoutetest1",
                    }
                ]
            }
        ],
    }, 
    {
        id: 5,
        fullname : "fullname5" ,
        email: "email" ,
        phone: "8293550691" ,
        username: "string" ,
        isAdmin: false ,
        
        roles : [
            {
                idRole : 1,
                roleDescription: "tenant",
                roleFather : 0
            },
            {
                idRole : 2,
                roleDescription: "user",
                roleFather : 0
            },
        ],
        database: [
            {
                idDb : 1,
                dbSchema : "dbSchematest1",
                dbName : "dbNametest1",
                serverName : "serverNametest1",
                serverRoute : "serverRoutetest1",
            }      
        ],
        users : [
            {
                id: 2,
                fullname : "string" ,
                email: "string" ,
                phone: "8293550691" ,
                username: "string" ,
                isAdmin: false ,

                idTenantFather : 1,
                roles : [
                    {
                        idRole : 1,
                        roleDescription: "tenant",
                        roleFather : 0
                    },
                    {
                        idRole : 2,
                        roleDescription: "user",
                        roleFather : 0
                    },
                ],
                databases: [
                    {
                        idDb : 1,
                        dbSchema : "dbSchematest1",
                        dbName : "dbNametest1",
                        serverName : "serverNametest1",
                        serverRoute : "serverRoutetest1",
                    }
                ]
            }
        ],
    }, 
  ];
  