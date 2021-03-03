import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DataTablesModule } from 'angular-datatables';

import { AuthGuardService } from 'shared/services/auth-guard.service';
import { SharedModule } from 'shared/shared.module';

import { AdminOrdersComponent } from './components/admin-orders/admin-orders.component';
import { AdminProductsComponent } from './components/admin-products/admin-products.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { AdminAuthService } from './services/admin-auth.service';

const redirectUnauthorized = () => redirectUnauthorizedTo(['login'])
const routes:Routes = [
  { path: "admin/products/new", component: ProductFormComponent, canActivate: [AuthGuardService, AdminAuthService], data: { authGuardPipe: redirectUnauthorized } },
  { path: "admin/products/:id", component: ProductFormComponent, canActivate: [AuthGuardService, AdminAuthService], data: { authGuardPipe: redirectUnauthorized } },
  { path: "admin/products", component: AdminProductsComponent, canActivate: [AuthGuardService, AdminAuthService], data: { authGuardPipe: redirectUnauthorized } },
  { path: "admin/orders", component: AdminOrdersComponent, canActivate: [AuthGuardService,AdminAuthService], data: { authGuardPipe: redirectUnauthorized } },
]

@NgModule({
  declarations: [
    AdminProductsComponent,
    AdminOrdersComponent,
    ProductFormComponent,],
  providers: [
    AdminAuthService,
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
  ]
})
export class AdminModule { }
