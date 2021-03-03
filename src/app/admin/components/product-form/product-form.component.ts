import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { CategoryService } from 'shared/services/category.service';
import { Product } from 'shared/models/app.products';
import { ProductService } from 'shared/services/product.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  categories$;
  key$: any;
  product!: Product
  id:string;

  constructor(categoryService:CategoryService,
     private productService:ProductService,
     private router:Router,
     private route:ActivatedRoute) {
    this.categories$ = categoryService.getCategories()
    this.key$ = categoryService.getKey().pipe(map(query => query.map(c => ({key: c.payload.key,
      ...c.payload.val()}))
    ));
    
    let preId = this.route.snapshot.paramMap.get('id');
    if(preId != null) this.id = preId
    else this.id ="" 
    if(this.id != "" || this.id != null ) this.productService.getOneProduct(this.id).pipe(take(1)).subscribe(p => this.product = p )
   }


   save(product:any){
     if(this.id) this.productService.updateProduct(this.id, product)
     else
     this.productService.create(product)
     this.router.navigate(['/admin/products'])
     console.log(product)
   }

  delete() {
    if (!confirm('Are you sure you want to delete this product')) return
    
    this.productService.deleteProduct(this.id);
    this.router.navigate(['/admin/products']);
  }
   


  ngOnInit(): void {
  }

}
