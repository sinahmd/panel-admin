import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, catchError, map, switchMap } from 'rxjs';
import { UserRoleCacheService } from '../services/user-role-cache.service';

@Injectable({
  providedIn: 'root'
})

export class AutheticationService {
  private apiUrl = 'http://localhost:3000/api/auth';

  sessionIdSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  private roleSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient, private router: Router, private cacheRole: UserRoleCacheService) {
    const storedSessionId = localStorage.getItem('sessionId');
    if (storedSessionId) {
      this.sessionIdSubject.next(storedSessionId);
    }
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
    const cacheKey = 'userRole';
    const cachedRole = this.cacheRole.get(cacheKey);


    if (cachedRole) {
      return new Observable((observer) => {
        observer.next(cachedRole);
        observer.complete();
      });
    }
    return this.http.get<any>('http://localhost:3000/api/users/current', { headers }).pipe(
      map(user => {
        const role = user?.role;
        this.roleSubject.next(role);
        this.cacheRole.set(cacheKey, role); 
          return role;
        // this.cacheRole.set( role);
        // localStorage.setItem('role', String(role));
      }),
      catchError(err => {
        console.error('Error fetching user role:', err);
        return of(undefined);
      })
    );
  }


  logout(): void {
    localStorage.removeItem('sessionId');
    localStorage.removeItem('role');
    this.sessionIdSubject.next(null);
    this.roleSubject.next(0);
    this.cacheRole.set('userRole', null)
    this.router.navigate(['/login']);
  }


  getHeaders(): HttpHeaders {
    const sessionId = localStorage.getItem('sessionId');
    return new HttpHeaders().set('Authorization', sessionId || '');
  }

  isAuthenticated(): boolean {
    return this.sessionIdSubject.value !== null;
  }

  getUserRole(): Observable<number> {

    const sessionId = this.sessionIdSubject.value;
    if (sessionId) {
      console.log(this.cacheRole, "this cache role for fetch role")
      return this.fetchUserRole(sessionId).pipe(
        map(() => this.cacheRole.get('userRole'))
      );
    } else {
      return of(0);
    }
  }
}
