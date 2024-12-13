import { Injectable } from '@angular/core';
import { User } from '../../models/user.medel';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AutheticationService } from './authetication.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = [];
  private usersSubject: BehaviorSubject<User[]> = new BehaviorSubject<User[]>(this.users);

  constructor(private http: HttpClient,private auth: AutheticationService) { }


  getUsers(): Observable<User[]> {
    // Check if the user is authenticated and get the token
    const token = this.auth.getToken();
    console.log("Token:", token);

    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      // Make HTTP GET request to the backend to get users
      this.http.get<User[]>('http://localhost:3000/users', { headers }).subscribe({
        next: (data) => {
          console.log(data,"data get")
          this.users = data;
          this.usersSubject.next(this.users); // Update the usersSubject with the fetched data
        },
        error: (err) => {
          console.error('Error fetching users:', err);
        }
      });
    }

    return this.usersSubject.asObservable(); // Return the observable of the users list
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
    // Get the JWT token from the Authentication service
    const token = this.auth.getToken();
    console.log(token,"token")
    // Set up headers with Authorization
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Send the request with the headers
    return this.http.post('http://localhost:3000/users', user, { headers, responseType: 'json' });
  }
//   addUser(user: User): Observable<any> {
//     return this.http.post('http://localhost:3000/users', user, { responseType: 'text' });
// }
  editUser(updatedUser: User): void {
    const index = this.users.findIndex((u) => u.id === updatedUser.id);
    if (index !== -1) {
      this.users[index] = updatedUser;
      this.usersSubject.next(this.users);
    }
  }

  deleteUser(userId: number): void {
    this.users = this.users.filter((u) => u.id?.value !== userId); 
    this.usersSubject.next(this.users);
  }


}
