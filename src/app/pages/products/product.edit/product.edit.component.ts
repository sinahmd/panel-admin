import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarService } from '../../../core/services/snackbar.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardContent, MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-product.edit',
  imports: [
    FormsModule,
    MatInputModule,
    MatCardContent,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatIconModule,
    MatOptionModule,
  ],
  templateUrl: './product.edit.component.html',
  styleUrl: './product.edit.component.scss'
})
export class ProductEditComponent implements OnInit {

  formGroup!: FormGroup;
  productId!: number;

  constructor(
    private productService: ProductService,
    private router: Router,
    private snackBarService: SnackBarService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.productId = +this.activatedRoute.snapshot.paramMap.get('id')!;

    this.formGroup = new FormGroup({
      name: new FormControl('', [Validators.required]),
      code: new FormControl('', [Validators.required]),
      weight: new FormControl('', [Validators.required]),
    });

    this.loadProductData();
  }

  loadProductData(): void {
    this.productService.getProductById(this.productId).subscribe({
      next: (product: Product) => {
        this.formGroup.patchValue({
          name: product.name || '',
          code: product.code || '',
          weight: product.weight || ''
        })
      },
      error: () => {
        this.snackBarService.openSnackBar("something wrong with fetch", false)
      }
    })
  }

  onSubmit(): void {
    if (this.formGroup.invalid) {
      this.snackBarService.openSnackBar("fill all fields", false)
      return
    }

    const updatedProduct: Product = { ...this.formGroup.value, id: this.productId };

    this.productService.updateProduct(updatedProduct).subscribe({
      next: () => {
        this.snackBarService.openSnackBar("updated successfully!", true)
        this.router.navigate(['/products'])
      },
      error: () => {
        this.snackBarService.openSnackBar('Error updating product', false);
      }
    })
  }
}
