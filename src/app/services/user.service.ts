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
    const sessionId = this.auth.sessionIdSubject.value;
    if (sessionId) {
      const headers = new HttpHeaders().set('Authorization', sessionId); // Add session ID to the headers

      this.http.get<User[]>('http://localhost:3000/api/users', { headers }).subscribe({
        next: (data) => {
          this.users = data;
          this.usersSubject.next(this.users);
        },
        error: (err) => {
          console.error('Error fetching users:', err);
        }
      });
    }

    return this.usersSubject.asObservable();
  }

  addUser(user: User): Observable<any> {
    console.log(this.auth.sessionIdSubject,"this auth")
    const sessionId = this.auth.sessionIdSubject.value as string;
    console.log(sessionId,"session id in add")
    const headers = new HttpHeaders().set('Authorization', sessionId);

    return this.http.post('http://localhost:3000/api/users', user, { headers });
  }
  editUser(updatedUser: User): void {
    const index = this.users.findIndex((u) => u.id === updatedUser.id);
    if (index !== -1) {
      this.users[index] = updatedUser;
      this.usersSubject.next(this.users);
    }
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`adgagaeg/${userId}`);
  }
  
}
