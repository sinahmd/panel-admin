import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, map } from 'rxjs';
import { User } from '../../models/user.medel';

@Injectable({
  providedIn: 'root'
})
export class AutheticationService {
  private readonly apiUrl = 'http://localhost:3000';

  private tokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  private roleSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0); // 0: Normal user, 1: Admin

  constructor(private http: HttpClient, private router: Router) {  }


  get token$(): Observable<string | null> {
    return this.tokenSubject.asObservable();
  }

  get role$(): Observable<number> {
    return this.roleSubject.asObservable();
  }


  login(username: string, password: string): Observable<void> {
    return this.http.post(`${this.apiUrl}/login`, { username, password }, { withCredentials: true }).pipe(
      map((response: any) => {
        const token = response.token;
        const role = response.role;

        this.tokenSubject.next(token);
        this.roleSubject.next(role);
      }),
      catchError((err) => {
        throw new Error('Login failed: ' + err.message);
      })
    );
  }

  logout(): void {
    this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).subscribe(() => {
      this.tokenSubject.next(null);
      this.roleSubject.next(0);
      this.router.navigate(['/login']);
    });
  }


  // getUsers(): User[] {
  //   return this.
  // }
  getToken(): string | null {
    return this.tokenSubject.value;
  }

  getHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token || ''}`);
  }

  isAuthenticated(): boolean {
    console.log(this.tokenSubject.value, "this.tokenSubject.value")
    return this.tokenSubject.value !== null;
  }

  getUserRole(): number {
    return this.roleSubject.value;
  }

}