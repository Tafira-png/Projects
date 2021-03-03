import { Component, OnDestroy, OnInit } from '@angular/core';

import { map } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { Product } from 'shared/models/app.products';
import { ProductService } from 'shared/services/product.service';


@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit, OnDestroy {

  products$!:Product[]
  filteredProducts! : any[]
  subscription:Subscription;
  dtOptions: DataTables.Settings = {}
  dtTrigger: Subject<any> = new Subject<any>();
  

  constructor(private productService:ProductService) { 
     this.subscription = this.productService.getAll().subscribe(products =>  { this.filteredProducts = this.products$ = products;
      this.dtTrigger.next(); })
    
    
  }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.dtTrigger.unsubscribe();
  }

  filter(query:string) {
    this.filteredProducts = (query) ?
    this.products$.filter(p => p.title.toLowerCase().includes(query.toLowerCase())) : 
    this.products$;
  }
}
