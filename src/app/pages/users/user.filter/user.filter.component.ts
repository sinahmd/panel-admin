import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'user-filter',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './user.filter.component.html',
  styleUrl: './user.filter.component.scss',
})
export class UserFilterComponent {
  constructor(private userService: UserService) {}
  formGroup = new FormGroup({
    userSearch: new FormControl(''),
  });
  onSearch() {
    if (
      this.formGroup.value?.userSearch === null ||
      this.formGroup.value?.userSearch === undefined
    ) return;
    this.userService.filtereUsers(this.formGroup.value.userSearch);
  }
}
