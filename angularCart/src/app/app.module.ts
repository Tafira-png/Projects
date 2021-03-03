import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from 'environments/environment';
import { SharedModule } from 'shared/shared.module';

import { AdminModule } from './admin/admin.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { ShoppingModule } from './shopping/shopping.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';



@NgModule({
  declarations: [
    AppComponent,
    
  ],
  imports: [
    BrowserModule,
    CoreModule,
    SharedModule,
    AdminModule,
    ShoppingModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    FontAwesomeModule,
  ],
  providers: [
    
   
 ],
  bootstrap: [AppComponent]
})
export class AppModule { }
