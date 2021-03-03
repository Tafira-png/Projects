import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductFilterComponent } from './product-list/product-filter/product-filter.component';
import { ProductListComponent } from './product-list/product-list.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { OrderSuccessComponent } from './order-success/order-success.component';
import { ShippingFormComponent } from './shipping-form/shipping-form.component';
import { ShoppingCartSummaryComponent } from './shopping-cart-summary/shopping-cart-summary.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { redirectUnauthorizedTo } from '@angular/fire/auth-guard';

import { AuthGuardService } from 'shared/services/auth-guard.service';
import { SharedModule } from 'shared/shared.module';
import { CheckOutComponent } from './check-out/check-out.component';

const redirectUnauthorized = () => redirectUnauthorizedTo(['login'])

const routes:Routes = [
  { path: "cart", component: ShoppingCartComponent },
  { path: "product-list", component: ProductListComponent },
  { path: "check-out", component: CheckOutComponent, canActivate: [AuthGuardService], data: { authGuardPipe: redirectUnauthorized } },
  { path: "order-success/:id", component: OrderSuccessComponent, canActivate: [AuthGuardService], data: { authGuardPipe: redirectUnauthorized } },
  { path: "my/orders", component: MyOrdersComponent, canActivate: [AuthGuardService], data: { authGuardPipe: redirectUnauthorized } },
]

@NgModule({
  declarations: [ 
    ProductListComponent,
    ProductFilterComponent,
    ShoppingCartComponent,
    OrderSuccessComponent,
    MyOrdersComponent,
    ShoppingCartSummaryComponent,
    ShippingFormComponent,
    CheckOutComponent],
  imports: [
 
    
    RouterModule.forChild(routes),
    SharedModule,
  ]
})
export class ShoppingModule { }
