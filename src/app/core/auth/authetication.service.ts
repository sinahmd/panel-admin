import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, catchError, map, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AutheticationService {
  private apiUrl = 'http://localhost:3000/api/auth';

  sessionIdSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  private roleSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0); 

  constructor(private http: HttpClient, private router: Router) {
    const storedSessionId = localStorage.getItem('sessionId');
    if (storedSessionId) {
      this.sessionIdSubject.next(storedSessionId);
    }

    const storedRole = localStorage.getItem('role');
    if (storedRole) {
      this.roleSubject.next(Number(storedRole));  
    }
  }

  get sessionId$(): Observable<string | null> {
    return this.sessionIdSubject.asObservable();
  }

  get role$(): Observable<number> {
    return this.roleSubject.asObservable();
  }

  login(username: string, password: string): Observable<void> {
    return this.http.post(`${this.apiUrl}`, { username, password }, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    }).pipe(
      map((response: any) => {
        const sessionId = response?.sessionId;
        if (sessionId) {
          localStorage.setItem('sessionId', sessionId); 
          this.sessionIdSubject.next(sessionId);
          return sessionId; 
        }
        throw new Error('Session ID not found');
      }),
      switchMap(sessionId => this.fetchUserRole(sessionId)), 
      catchError(err => {
        throw new Error('Login failed: ' + err.message);
      })
    );
  }

  private fetchUserRole(sessionId: string): Observable<void> {
    const headers = new HttpHeaders().set('Authorization', sessionId);
    return this.http.get<any>('http://localhost:3000/api/users/current', { headers }).pipe(
      map(user => {
        const role = user?.role;
        this.roleSubject.next(role);
        localStorage.setItem('role', String(role));
      }),
      catchError(err => {
        console.error('Error fetching user role:', err);
        return of(undefined); 
      })
    );
  }

  // logout(): void {
  //   const sessionId = localStorage.getItem('sessionId');
  //   if (sessionId) {
  //     this.http.post(`${this.apiUrl}/logout`, { sessionId }).subscribe(() => {
  //       localStorage.removeItem('sessionId');
  //       localStorage.removeItem('role'); 
  //       this.sessionIdSubject.next(null);
  //       this.roleSubject.next(0); 
  //       this.router.navigate(['/login']);
  //     });
  //   }
  // }
  logout(): void {
    localStorage.removeItem('sessionId');
    localStorage.removeItem('role');
    this.sessionIdSubject.next(null);
    this.roleSubject.next(0);
    this.router.navigate(['/login']);
  }


  getHeaders(): HttpHeaders {
    const sessionId = localStorage.getItem('sessionId');
    // const sessionId = this.sessionIdSubject.value;
    return new HttpHeaders().set('Authorization', sessionId || '');
  }

  isAuthenticated(): boolean {    
    return this.sessionIdSubject.value !== null;
  }

  getUserRole(): Observable<number> {
    return this.roleSubject.asObservable();
  }
}
