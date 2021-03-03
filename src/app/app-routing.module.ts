import { NgModule } from '@angular/core';
import { redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { ActivatedRouteSnapshot, RouterModule, RouterStateSnapshot, Routes } from '@angular/router';
import { AuthGuardService } from 'shared/services/auth-guard.service';

import { AdminAuthService } from './admin/services/admin-auth.service';
import { CheckOutComponent } from './shopping/check-out/check-out.component';
import { HomePageComponent } from './core/components/home-page/home-page.component';
import { LoginComponent } from './core/components/login/login.component';
import { MyOrdersComponent } from './shopping/my-orders/my-orders.component';
import { OrderSuccessComponent } from './shopping/order-success/order-success.component';
import { ProductListComponent } from './shopping/product-list/product-list.component';
import { ShoppingCartComponent } from './shopping/shopping-cart/shopping-cart.component';


const redirectUnauthorized = () => redirectUnauthorizedTo(['login'])

const getUrl = (next:ActivatedRouteSnapshot,snapshot:RouterStateSnapshot) => {}

const routes: Routes = [
{ path: "", component: HomePageComponent },
{ path: "login", component: LoginComponent },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    AuthGuardService,
    AdminAuthService
  ]
})
export class AppRoutingModule { }
