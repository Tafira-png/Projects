import { Component, OnInit } from '@angular/core';
import { AuthService } from 'shared/services/auth.service';
import { OrderService } from 'shared/services/order.service';
import {  switchMap} from 'rxjs/operators'
import { Observable } from 'rxjs';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {

  orders$:Observable<any>;

  constructor(
    private authService:AuthService,  private orderService:OrderService
  ) { 
    this.orders$ = authService.user$.pipe(switchMap(u => orderService.getOrderById(u?.uid))) 
    this.orders$.subscribe( x=> console.log(x))
    
   }

  ngOnInit(): void {
  }

}
