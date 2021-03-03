import { Component, OnInit } from '@angular/core';
import { AuthService } from 'shared/services/auth.service';
import { AppUser } from 'shared/models/app.user';
import { ShoppingCart } from 'shared/models/shopping-cart';
import { ShoppingCartService } from 'shared/services/shopping-cart.service';
import {Observable} from 'rxjs'
import {faLeaf, faShoppingCart} from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  faLeaf = faLeaf
  faShoppingCart = faShoppingCart;
  appUser!: AppUser| null;
  collapsed = true;
  shoppingCartItemCount!:number;
  cart$!: Observable<ShoppingCart>;

  constructor(public auth:AuthService, private shoppingCartService:ShoppingCartService) { 
   
  
  }
 async ngOnInit(){
    this.auth.appUser$.subscribe(appUser => this.appUser = appUser)
    this.cart$ = await this.shoppingCartService.getCart()
  }

 
 logout(){
  this.auth.logout()
 }
} 
