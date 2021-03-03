
import { Items } from "./app.items";
import { Product } from "./app.products";

export class ShoppingCart {
   
    items: Items[] = []
    constructor(private itemsMap:{[productId: string]:Items})  {
        this.itemsMap = itemsMap || {}
        for(let productId in itemsMap) {
           let item = itemsMap[productId];
           this.items.push(new Items({...item,key: productId}))
        }
    }

    getQuantity (product:Product){
        if(!this.itemsMap)
        return 0 
        let item = this.itemsMap[product.key]
        return item ? item.quantity : 0;
      }


    get totalPrice() {
        let sum = 0;
        for(let productId in this.items)
        sum += this.items[productId].totalPrice
        return sum;
    }


    get totalItemsCount(){
        let count = 0;
        for(let productId in this.itemsMap)
        count +=  this.itemsMap[productId].quantity;
        return count;
    }
}