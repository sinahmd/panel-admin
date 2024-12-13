import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor() { }

  getProducts(): Observable<Product[]> {
    return this.productsSubject.asObservable();
  }
  
  private products: Product[] = [];
  private productsSubject: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>(this.products);

  addProduct(product: Product): void {
    product.id = this.products.length + 1;
    this.products.push(product);
    this.productsSubject.next(this.products);
  }

  deleteProduct(productId: number): void {
    this.products = this.products.filter((p) => p.id !== productId);
    this.productsSubject.next(this.products);
  }

}
