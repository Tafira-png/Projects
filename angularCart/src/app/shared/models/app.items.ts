import { Product } from "./app.products";

export class Items {
    key!: string;
    title!:string;
    imageUrl!: string;
    price!:number;
    quantity!:number;
    category!: string;
    
    constructor(init?:Partial<Items>){
        Object.assign(this,init)
    }

    get totalPrice() { return this.price * this.quantity

    }
}