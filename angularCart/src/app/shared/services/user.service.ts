import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject, SnapshotAction } from '@angular/fire/database';
import * as firebase from 'firebase'
import { Observable } from 'rxjs';
import { AppUser } from 'shared/models/app.user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private db: AngularFireDatabase) { }

  save(user:firebase.default.User){
    this.db.object('/users/' + user.uid).update({
      name: user.displayName,
      email: user.email
    })
  }

  get(uid:string):AngularFireObject<AppUser> {
    return this.db.object('/users/' + uid)
}
}
