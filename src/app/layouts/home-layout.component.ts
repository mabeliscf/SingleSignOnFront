import { Component } from '@angular/core';
import { AuthService } from '../Service/auth.service';

@Component({
  selector: 'app-home-layout',
  template: '<app-navbar></app-navbar><router-outlet></router-outlet>',
  styles: []
})
export class HomeLayoutComponent {
 
      
}