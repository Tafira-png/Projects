import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { map,  } from 'rxjs/operators';
import { concat} from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private db:AngularFireDatabase) { }

  getCategories(){  
    concat
     return this.db.list<any>('/categories', query => query.orderByChild('name')).valueChanges()
     
  }

  getKey(){
    return this.db.list<any>('/categories', query => query.orderByChild('name')).snapshotChanges()
  }
}
