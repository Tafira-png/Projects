import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Product } from 'shared/models/app.products';
import {take, map }from 'rxjs/operators'
import { Items } from 'shared/models/app.items';
import { Observable } from 'rxjs';
import { ShoppingCart } from 'shared/models/shopping-cart';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  constructor(private db:AngularFireDatabase) { }



 

  async getCart(): Promise<Observable<ShoppingCart>> {
    let cartId = await this.getOrCreateCartId()
    return this.db.object<any>("/shopping-carts/" + cartId).valueChanges().pipe(map(x => new ShoppingCart(x.items)))

  }


  addtoCart(product: Product) {
    this.updateItem(product, 1)
  }
  removeFromCart(product: Product) {
    this.updateItem(product, -1)

  }

  async clearCart() {
   let cartId = await this.getOrCreateCartId();
   this.getItem(cartId).remove()
  }


  private create() {
    return this.db.list<any>("/shopping-carts").push({
      dateCreated: new Date().getDate()
    })
  }
  

  private async getOrCreateCartId():Promise<string | null > {
    let cartId = localStorage.getItem('cartId');
    if (cartId)  return cartId

    let result = await this.create()
    if (result.key != null) {
    localStorage.setItem('cartId', result.key);
    return result.key
    }
   
    if (cartId != null)
      return cartId 
    else return null
  }

private getItem(cartId:string | null, productId?:string) {
  if(productId == undefined) return this.db.object<any>('/shopping-carts/' + cartId + '/items') 
  return this.db.object<any>('/shopping-carts/' + cartId + '/items/' + productId)
}



  private async updateItem(product:Product, change:number) {

    let cartId =  await this.getOrCreateCartId()
    let item = this.getItem(cartId,product.key)
    
    let item$ = item.valueChanges()

     item$.pipe(take(1)).subscribe( (itemP:Items) => {
      if(itemP && itemP.quantity + change == 0   ) item.remove()
      else {
      if(itemP) item.update({
        category: product.category,
        title: product.title, 
        imageUrl: product.imageUrl,
        price: product.price,
        quantity: itemP.quantity + change }
        )
      else{
        item.set({title: product.title, 
          imageUrl: product.imageUrl,
          category: product.category,
          price: product.price, quantity: 1 })
        console.log("else block completed")
      }}
    })
  } 
}
