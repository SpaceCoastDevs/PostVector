import { Routes } from '@angular/router';
import { AuthSuccessComponent } from './auth-success/auth-success.component';
import { HomePageComponent } from './home-page/home-page.component';

export const routes: Routes = [
  {
    path: 'auth-success',
    component: AuthSuccessComponent
  }
  ,
  {
    path: '',
    component: HomePageComponent
  }
];
