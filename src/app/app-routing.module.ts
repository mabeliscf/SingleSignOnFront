import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateAccountComponent } from './create-account/create-account.component';
import { LoginComponent } from './login/login.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { OktaAuthGuard, OktaCallbackComponent } from '@okta/okta-angular';
import { RegisterUserComponent } from './register-user/register-user.component';



const routes: Routes = [

{path: 'login', component:LoginComponent},
{path:'create', component:CreateAccountComponent},
{path:'welcome', component:WelcomeComponent },
{ path: 'login/callback', component: OktaCallbackComponent },
{ path: 'register', component: RegisterUserComponent},

  //default path
{path:"", redirectTo:"login", pathMatch: "full"},

//redirect to protected path
{
  path: 'protected',
  loadChildren: () => import('./protected/protected.module').then(m => m.ProtectedModule),
  canLoad: [OktaAuthGuard]
},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
