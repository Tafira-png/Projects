import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductService } from 'shared/services/product.service';
import { switchMap } from 'rxjs/operators';
import { Product } from 'shared/models/app.products';
import { ActivatedRoute } from '@angular/router';
import { ShoppingCartService } from 'shared/services/shopping-cart.service';
import { Observable, Subscription } from 'rxjs';
import { ShoppingCart } from 'shared/models/shopping-cart';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  categories$!: any[]
  products: Product[] = []
  filteredProducts!: Product[]  
  category!: string;
  cart$!: Observable<ShoppingCart>
 
  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private shoppingCartService: ShoppingCartService,
  ) {}
   
 async ngOnInit(){
  this.cart$ = await this.shoppingCartService.getCart();
  this.populateProducts()
  }

  private populateProducts (){
    this.productService.getAll().pipe(
      switchMap(x => {
        this.products = x
        return this.route.queryParamMap
      })
    ).subscribe(params => {
      let preCategory = params.get('category')
      if (preCategory != null) this.category = preCategory
      this.applyFilter()
    })
  }
  private applyFilter() {
    this.filteredProducts = (this.category) ?
    this.products.filter(p => p.category === this.category) :
    this.products
  }
 
}
