import { Injectable } from '@angular/core';
import { User } from '../../models/user.medel';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = [];
  private usersSubject: BehaviorSubject<User[]> = new BehaviorSubject<User[]>(this.users);

  constructor(private http: HttpClient) { }


  getUsers(): Observable<User[]> {
    return this.usersSubject.asObservable()
  }
  // getAllUsers(): Observable<User[]> {
  //   return this.http.get(`sdasd`)
  // }

  // addUser(user: User): void {
  //   user.id = this.users.length + 1
  //   this.users.push(user)
  //   this.usersSubject.next(this.users);
  // }
  addUser(user: User): Observable<any> {
    return this.http.post('http://localhost:3000/api/user/add', user, { responseType: 'text' });
}
  editUser(updatedUser: User): void {
    const index = this.users.findIndex((u) => u.id === updatedUser.id);
    if (index !== -1) {
      this.users[index] = updatedUser;
      this.usersSubject.next(this.users);
    }
  }

  deleteUser(userId: number): void {
    this.users = this.users.filter((u) => u.id !== userId);
    this.usersSubject.next(this.users);
  }


}
