import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import {map} from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private db: AngularFireDatabase) { }


  create(product:any) {
    this.db.list('/products/products').push(product);
  }

  getAll(){
    return this.db.list<any>('/products/products').snapshotChanges().pipe(map(query => query.map(c => ({key: c.payload.key, ...c.payload.val()}))
    ))
  }

  getAllVC(){
    return this.db.list<any>('/products/products').valueChanges()
  }


  getOneProduct( productid:string){
    return this.db.object<any>('/products/products/' + productid).valueChanges()
  }

  updateProduct(productId:string, product:Object) {
     return this.db.object('/products/products/' + productId).update(product);
  }
  deleteProduct(productId:string){
    this.db.object('/products/products/' + productId).remove();
  }
}
