import { Component } from '@angular/core';
import { ProductService } from '../services/product.service';
import {  Router } from '@angular/router';

@Component({
  selector: 'app-product.add',
  imports: [],
  templateUrl: './product.add.component.html',
  styleUrl: './product.add.component.scss'
})
export class ProductAddComponent {
    constructor(
      private productService: ProductService,
      private router: Router
    ) {}
}
