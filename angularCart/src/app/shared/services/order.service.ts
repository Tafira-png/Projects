import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';

import { ShoppingCartService } from 'shared/services/shopping-cart.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private db: AngularFireDatabase, private shoppingcartService:ShoppingCartService) { }

  async placeOrder(order:any){

    this.db.list("/orders").query.ref.update
  
     let result = await this.db.list('/orders').push(order);
     this.shoppingcartService.clearCart();
    return result;
  }

  getOrders() {
    return this.db.list('/orders').valueChanges()
  }

  getOrderById(userId:string | undefined){
    console.log(userId)
    if(userId != undefined)
    return this.db.list('/orders/', ref => {
    return ref.orderByChild('userId').equalTo(userId);
    }).valueChanges()
    else{return new Observable}
  }
}
