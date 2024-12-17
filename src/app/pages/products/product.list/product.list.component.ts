import { Component } from '@angular/core';
import { Product } from '../../../core/models/product.model';
import { Router } from '@angular/router';
import { AutheticationService } from '../../../core/auth/authetication.service';
import { ProductService } from '../../../core/services/product.service';
import { MatCard, MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SnackBarService } from '../../../core/services/snackbar.service';

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
    private productService: ProductService,
    private snackBar: SnackBarService
  ) { }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.productService.getProducts().subscribe({
        next: (data) => {
          this.products = data;
        },
      });
    }
  }

  navigateToEdit(productId: any): void {
    this.router.navigate([`products/edit/${productId}`])
  }

  cancelEditing(index: number): void {
    this.editingStates[index] = null;
  }

  navigateToAdd(): void {
    this.router.navigate(['/products/add']);
  }

  deleteProduct(productId: number): void {

      this.productService.deleteProduct(productId).subscribe({
        next: () => {
          this.snackBar.openSnackBar('Product deleted successfully', true);
          this.productService.getProducts();  
        },
        error: (err) => {
          this.snackBar.openSnackBar('Error deleting Product', false);
          console.error('Error deleting Product:', err);
        }
      });
    
  }

}
