import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './components/home-page/home-page.component';
import { LoginComponent } from './components/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'shared/shared.module';

const routes:Routes = [

]

@NgModule({
  declarations: [
    HomePageComponent,
    NavbarComponent,
    LoginComponent,],
    exports : [
      NavbarComponent
    ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class CoreModule { }
