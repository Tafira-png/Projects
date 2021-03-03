import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import * as firebase from 'firebase'
import { Observable } from 'rxjs';
import { AppUser } from 'shared/models/app.user';
import {map,switchMap} from 'rxjs/operators';
import { UserService } from 'shared/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  
  user$ :Observable<firebase.default.User | null> 
   

  constructor(private afAuth: AngularFireAuth,
     private userService: UserService,
     private route: ActivatedRoute) { 
       this.user$ = afAuth.authState
  }

  login(){
    let returnURL = this.route.snapshot.queryParamMap.get('returnUrl') || '/'
    localStorage.setItem('returnUrl', returnURL)
    this.afAuth.signInWithRedirect( new firebase.default.auth.GoogleAuthProvider())
  }

  logout(){
    this.afAuth.signOut()
  }


  get appUser$():Observable<AppUser | null>  {
    return this.user$.pipe(switchMap(user => {
      
      return this.userService.get(user?.uid!).valueChanges()

    }))
  }

}