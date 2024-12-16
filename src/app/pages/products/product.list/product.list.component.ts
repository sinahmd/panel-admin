import { Component } from '@angular/core';
import { Product } from '../../../core/models/product.model';
import { Router } from '@angular/router';
import { AutheticationService } from '../../../core/auth/authetication.service';
import { ProductService } from '../../../core/services/product.service';
import { MatCard, MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product.list',
  imports: [MatCard, MatCardModule, CommonModule, FormsModule],
  templateUrl: './product.list.component.html',
  styleUrl: './product.list.component.scss',
})
export class ProductListComponent {
  products: Product[] = [];
  editingStates: any[] = [];

  constructor(
    private router: Router,
    private authService: AutheticationService,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.productService.getProducts().subscribe({
        next: (data) => {
          console.log(data, 'data');
          this.products = data;
        },
      });
    }
  }

  startEditing(index: number, item: any): void {
    if (!this.editingStates[index]) {
      this.editingStates[index] = {
        editingIndex: index,
        editingRow: { ...item },
        invalidFields: {}
      };
    }
  }

  saveEditing(index: number, item: any): void {
    const updatedProduct = this.editingStates[index].editingRow;

    this.productService.updateProduct(updatedProduct).subscribe({
      next: (updatedProduct) => {
        console.log('User updated', updatedProduct);
        this.products[index] = updatedProduct;
        this.cancelEditing(index);
      },
      error: (err) => {
        console.error('Error updating product:', err);
      }
    });
  }
  cancelEditing(index: number): void {
    this.editingStates[index] = null;
  }

  navigateToAdd(): void {
    this.router.navigate(['/products/add']);
  }

}
