import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateAccountComponent } from './create-account/create-account.component';
import { LoginComponent } from './login/login.component';
import { WelcomeComponent } from './welcome/welcome.component';
import {  OktaAuthGuard, OktaCallbackComponent } from '@okta/okta-angular';
import { RegisterUserComponent } from './register-user/register-user.component';
import { HomeLayoutComponent } from './layouts/home-layout.component';
import { DatabaseComponent } from './database/database.component';
import { RolesComponent } from './roles/roles.component';
import { UsersComponent } from './users/users.component';



const routes: Routes = [
  {

    path:"z", component: HomeLayoutComponent,
    children: [
          {path:'welcome', component:WelcomeComponent  }, // canActivate: [AuthGuard]
          {path:'register', component:RegisterUserComponent },
          {path: 'database', component: DatabaseComponent},
          {path:'roles', component: RolesComponent },
          {path:'users', component: UsersComponent},
    ]
  },
  // {

    // path:"", component: LoginLayoutComponent,
    // children: [
          {path:'login', component:LoginComponent }, // canActivate: [AuthGuard]
          {path:'create', component:CreateAccountComponent  },
          
  //   ]
  // },//default path
  {path:"", redirectTo:"login" , pathMatch: "full"},
  //redirect to protected path
  {
    path: 'protected',
    loadChildren: () => import('./protected/protected.module').then(m => m.ProtectedModule)//,
    ///canLoad: [AuthGuard]
  },
  { path: 'login/callback', component: OktaCallbackComponent  },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
