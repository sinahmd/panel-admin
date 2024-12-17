import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AutheticationService } from '../auth/authetication.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Product } from '../models/product.model';
import { SnackBarService } from './snackbar.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private products: Product[] = [];
  private productSubject: BehaviorSubject<Product[]> = new BehaviorSubject<
    Product[]
  >(this.products);
  private apiUrl = 'http://localhost:3000/api/products';

  constructor(private http: HttpClient, private auth: AutheticationService, private snackBar: SnackBarService, private router: Router) { }

  getProducts(): Observable<Product[]> {
    const sessionId = this.auth.sessionIdSubject.value;

    if (sessionId) {
      const headers = this.auth.getHeaders();

      this.http.get<Product[]>(this.apiUrl, { headers }).subscribe({
        next: (data) => {
          this.products = data;
          this.productSubject.next(this.products);
        },
        error: (err) => {
          if(err.status === 403 || err.status === 401) {
            this.router.navigate(['/login'])
          }
          this.snackBar.openSnackBar(`error: ${err?.error}`, false)
        },
      });
    }

    return this.productSubject.asObservable();
  }

  addProduct(product: Product): Observable<any> {  // TODO: fix any
    const sessionId = this.auth.sessionIdSubject.value as string;
    if (sessionId) {
      const headers = this.auth.getHeaders();

      return this.http.post(this.apiUrl, product, { headers });
    }
    if (!sessionId) {
      this.snackBar.openSnackBar("there is no session id", false);
      return of(null); 
    }
    return this.productSubject.asObservable();
  }

  updateProduct(product: Product): Observable<any> {
    const headers = this.auth.getHeaders();
    return this.http.put<any>(this.apiUrl, product, { headers });
  }

  getProductById(productId: number): any {
    console.log(productId,"prod id")
      const headers = this.auth.getHeaders();
      return this.http.get<Product>(`${this.apiUrl}/${productId}`, { headers } )
  }
}
