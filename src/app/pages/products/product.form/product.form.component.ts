import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { SnackBarService } from '../../../core/services/snackbar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { MatInputModule } from '@angular/material/input';
import { MatCardContent, MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-product.form',
  imports: [
    FormsModule,
    MatInputModule,
    MatCardContent,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatOptionModule,
  ],
  templateUrl: './product.form.component.html',
  styleUrl: './product.form.component.scss'
})
export class ProductFormComponent implements OnInit {

  formGroup!: FormGroup;
  productId?: number;
  isEditMode = false


  constructor (
    private productService: ProductService,
    private snackBarService: SnackBarService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.productId = +this.activatedRoute.snapshot.paramMap.get('id')!
    this.isEditMode = !!this.productId

    this.formGroup = new FormGroup({
      name: new FormControl('',[Validators.required]),
      code: new FormControl('',[Validators.required]),
      weight: new FormControl('',[Validators.required]),
    })

    if(this.isEditMode) {
      this.loadProductData()
    }
  }


  loadProductData(): void {

    if(!this.productId) return

    this.productService.getProductById(this.productId).subscribe({
      next: (product: Product) => {
        this.formGroup.patchValue({
          name: product.name || '',
          code: product.code || '',
          weight: product.weight || ''
        })
      },
      error: () => {
        this.snackBarService.openSnackBar("Error fetching product data", false)

      }
    })
  }

  onSubmit(): void {
    if (this.formGroup.invalid) {
      this.snackBarService.openSnackBar("Please fill all fields", false)
      return
    }

    const formData = this.formGroup.value;
    const product: Product = { ...formData}

    if(this.isEditMode && this.productId) {
      product.id = this.productId

      this.productService.updateProduct(product).subscribe({
        next: () => {
          this.snackBarService.openSnackBar('Product updated successfully!' , true)
          this.router.navigate(['/products'])
        },
        error: (err) => {
          this.snackBarService.openSnackBar('Error updating product', false);
        }
      })
    } else {
      this.productService.addProduct(product).subscribe({
        next: () => {
          this.snackBarService.openSnackBar('Product created successfully!', true)
          this.router.navigate(['/products'])
        },
        error: (err) => {
          this.snackBarService.openSnackBar('Error creating product', false);
        }
      })
    }
  }
}
