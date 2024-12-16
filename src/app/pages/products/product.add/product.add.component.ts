import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SnackBarService } from '../../../core/services/snackbar.service';
import { Product } from '../../../core/models/product.model';
import { MatCardContent, MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { notEmptyValidator } from '../../../core/validators/requierd.validator';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product.add',
  imports: [
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatCardContent,
    MatCardModule,
    MatButtonModule,
    CommonModule,
  ],
  templateUrl: './product.add.component.html',
  styleUrl: './product.add.component.scss',
})
export class ProductAddComponent implements OnInit {
  formGroup!: FormGroup;

  constructor(
    private productService: ProductService,
    private snackBarService: SnackBarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      name: new FormControl(null, [Validators.required, notEmptyValidator()]),
      code: new FormControl(null, [Validators.required]),
      weight: new FormControl(null, [Validators.required]),
    });
  }

  onSubmit(): void {
    console.log(this.formGroup)
    if (this.formGroup.invalid) {
      this.snackBarService.openSnackBar('Please fill in all fields', false);
      return;
    }
    const newProduct: Product = this.formGroup.value;
    this.productService.addProduct(newProduct).subscribe({
      next: () => {
        this.snackBarService.openSnackBar('Product created!', true);
        this.router.navigate(['/products']);
      },
      error: (err) => {
        this.snackBarService.openSnackBar(`Error creating user: ${err}`, false);
      },
    });
  }
}
