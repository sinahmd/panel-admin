import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { User } from '../../../models/user.medel';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardContent, MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Observer } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-add',
  imports: [FormsModule, MatCardContent, ReactiveFormsModule ,MatCardModule, MatButtonModule],
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss',
})
export class AddComponent {
  // user: User = {
  //   id: 0,
  //   firstName: '',
  //   lastName: '',
  //   role: 0,
  //   nationalCode: '',
  //   phoneNumber: '',
  //   username: '',
  //   password: '',
  // };

  constructor(private userService: UserService,
     private router: Router,
     private snackBar: MatSnackBar,) {}
  ngOnInit(): void {
  }

  formGroup: FormGroup = new FormGroup<User>({

    phoneNumber: new FormControl('',
    {nonNullable: true,
      validators:[Validators.required]}
      ), 
      username:  new FormControl("",
      {nonNullable: true,
        validators:[Validators.required]}
        ),
        password:  new FormControl("",
    {nonNullable: true,
      validators:[Validators.required]}
      ),
      firstName:  new FormControl("",
      {nonNullable: true,
        validators:[Validators.required]}
        ),
    lastName:  new FormControl('',
     {
      nonNullable: true,
      validators:[Validators.required]}),
      role:  new FormControl(0,
      {nonNullable: true,
        validators:[Validators.required]}
        ),
      nationalCode:  new FormControl('',
      {
       nonNullable: true,
       validators:[Validators.required]})
  })
  openSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 2000,
      panelClass: ['error-snackbar'],
    });
  }

  userObserver: Observer<any> = {
      next: (res) => {
        this.router.navigate(['/users']);
      },
      error: (err) => {
        this.openSnackBar(`${err}`)
      },
      complete: () => {},
  }

  onSubmit(): void {
    // this.userService.addUser(this.user);
    if (this.formGroup.invalid) {
      this.openSnackBar(`fill the fields`);
    }
    if (this.formGroup.valid) {
      this.userService.addUser(this.formGroup.value).subscribe(this.userObserver)
    }
    this.router.navigate(['/users']);
  }

  // formGroup: FormGroup = new FormGroup<User>({
  //   firstName:  new FormControl("",
  //   {nonNullable: true,
  //     validators:[Validators.required]}
  //     ),
  //   lastName:  new FormControl('',
  //    {
  //     nonNullable: true,
  //     validators:[Validators.required]}),
  //     nationalCode:  new FormControl(null,
  //     {
  //      nonNullable: true,
  //      validators:[Validators.required]}),
  //          phoneNumber:  new FormControl(null,
  //   {nonNullable: true,
  //     validators:[Validators.required]}
  //     ), 
  //       username:  new FormControl("",
  //     {nonNullable: true,
  //       validators:[Validators.required]}
  //       ),
  //       password:  new FormControl("",
  //   {nonNullable: true,
  //     validators:[Validators.required]}
  //     ),
  // })

  // userObserver: Observer<any> = {
  //   next: (response) => {
  //     console.log('succus', response);
  //     alert('user created successfully!');
  //     this.router.navigate(['/alluser']);
  //   },
  //   error: (err) => {
  //     console.error('error:', err);
  //     alert('failed');
  //   },
  //   complete: () => {
  //     console.log('Add user request complete.');
  //   },
  // };

  // onSubmit(): void {
  //   console.log(this.formGroup.valid,"valiiid")
  //   if (this.formGroup.valid) {
      
  //     this.userService.addUser(this.formGroup.value).subscribe(this.userObserver);
  //   }
  // }
}
