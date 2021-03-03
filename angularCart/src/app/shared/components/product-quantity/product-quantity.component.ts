import { Component, Input  } from '@angular/core';
import { Product } from 'shared/models/app.products';
import { ShoppingCartService } from 'shared/services/shopping-cart.service';

@Component({
  selector: 'product-quantity',
  templateUrl: './product-quantity.component.html',
  styleUrls: ['./product-quantity.component.css']
})
export class ProductQuantityComponent  {

  @Input('product') product!:Product
  @Input('shopping-cart') shoppingCart: any ;

  constructor(private cartService:ShoppingCartService) { }

 
  addToCart() {
    this.cartService.addtoCart(this.product);
  }

  removeFromCart(){
    this.cartService.removeFromCart(this.product)
  }

  


}
