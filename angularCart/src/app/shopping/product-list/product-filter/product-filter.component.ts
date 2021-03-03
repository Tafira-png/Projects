import { Component, Input, OnInit } from '@angular/core';

import {map} from 'rxjs/operators'
import { CategoryService } from 'shared/services/category.service';

@Component({
  selector: 'product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.css']
})
export class ProductFilterComponent  {
  categories$:any;
  @Input('category') category!:string;

  constructor(private categories:CategoryService) {
    this.categories.getKey().pipe(map(query => query.map(c => ({ key: c.payload.key, ...c.payload.val() }))
    )).subscribe(p => { this.categories$ = p; console.log(p) })
   }



}
