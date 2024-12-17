import { Injectable } from '@angular/core';
import { User } from '../models/user.medel';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AutheticationService } from '../auth/authetication.service';
import { SnackBarService } from './snackbar.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = [];
  private usersSubject: BehaviorSubject<User[]> = new BehaviorSubject<User[]>(this.users);
  private apiUrl = 'http://localhost:3000/api/users';
  constructor(private http: HttpClient,private auth: AutheticationService, private snackBarService: SnackBarService, private router: Router) { }


  getUsers(): Observable<User[]> {
    const sessionId = this.auth.sessionIdSubject.value;
    if (sessionId) {
      const headers = new HttpHeaders().set('Authorization', sessionId); 

      this.http.get<User[]>('http://localhost:3000/api/users', { headers }).subscribe({
        next: (data) => {
          this.users = data;
          this.usersSubject.next(this.users);
          return this.users
        },
        error: (err) => {
          if(err.status === 403 || err.status === 401) {
            this.router.navigate(['/login'])
          }
          this.snackBarService.openSnackBar(err?.error , false)
        }
      });
    }

    return this.usersSubject.asObservable();
  }

  addUser(user: User): Observable<any> { // TODO : fix any
    const sessionId = this.auth.sessionIdSubject.value as string;
    const headers = new HttpHeaders().set('Authorization', sessionId);

    return this.http.post(this.apiUrl, user, { headers });
  }

  editUser(updatedUser: User): void {
    const index = this.users.findIndex((u) => u.id === updatedUser.id);
    if (index !== -1) {
      this.users[index] = updatedUser;
      this.usersSubject.next(this.users);
    }
  }

  getUserById(userId: number): Observable<User> {
    const headers = this.auth.getHeaders();
    return this.http.get<User>(`${this.apiUrl}/${userId}`, { headers });
  }
  
  updateUser(user: any): Observable<any> {
    const headers = this.auth.getHeaders();
    return this.http.put<any>(this.apiUrl, user, { headers });
  }

  deleteUser(userId: number): Observable<any> {
    const headers = this.auth.getHeaders();
    return this.http.delete<string>(`${this.apiUrl}/${userId}`, { headers });
  }
  
}
