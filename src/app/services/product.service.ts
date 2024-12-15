import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AutheticationService } from './authetication.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private products: Product[] = [];
  private productSubject: BehaviorSubject<Product[]> = new BehaviorSubject<
    Product[]
  >(this.products);
  private apiUrl = 'http://localhost:3000/api/products';

  constructor(private http: HttpClient, private auth: AutheticationService) {}

  getProducts(): Observable<Product[]> {
    const sessionId = this.auth.sessionIdSubject.value;

    if (sessionId) {
      const headers = new HttpHeaders().set('Authorization', sessionId);

      this.http.get<Product[]>(this.apiUrl, { headers }).subscribe({
        next: (data) => {
          this.products = data;
          this.productSubject.next(this.products);
        },
        error: (err) => {
          console.log(err);
        },
      });
    }

    return this.productSubject.asObservable();
  }

  addProduct(product: Product): Observable<any> {  // TODO: fix any
    const sessionId = this.auth.sessionIdSubject.value as string;
    const headers = new HttpHeaders().set('Authorization', sessionId);

    return this.http.post(this.apiUrl, product, { headers });
  }

  updateProduct(product: Product): Observable<any> {
    const headers = this.auth.getHeaders();
    return this.http.put<any>(this.apiUrl, product, { headers });
  }
}
