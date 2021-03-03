import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'shared/services/auth.service';
import { UserService } from 'shared/services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'organic-shopping-project';

  constructor(private user1: UserService, private auth: AuthService, router: Router) {
    auth.user$.subscribe(user => {
      if (!user) return;
      user1.save(user);

      let returnUrl = localStorage.getItem('returnUrl') 
      if (!returnUrl) return;

      localStorage.removeItem('returnUrl')
      router.navigateByUrl(returnUrl)


      
    })
  }
}