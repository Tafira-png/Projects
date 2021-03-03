import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { AuthService } from 'shared/services/auth.service';
import {map,switchMap} from 'rxjs/operators';
import { UserService } from 'shared/services/user.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService implements CanActivate {

  constructor(private auth: AuthService, private userService: UserService) { }

  canActivate(): Observable<boolean> {
    return this.auth.appUser$
   .pipe(map(appUser => {
      console.log(appUser)
      if (typeof appUser?.isAdmin === "boolean") {
        return appUser.isAdmin
      }
      else {
        return false
      }
    }))
  }
}
