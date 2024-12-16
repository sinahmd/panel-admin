import { FormControl } from "@angular/forms";

export interface User {
    id?: FormControl<number>;
    firstName:FormControl<string>;
    lastName: FormControl<string>;
    role:FormControl<0 | 1>;
    nationalCode: FormControl<string>;
    mobile: FormControl<string>;
    username: FormControl<string>;
    password: FormControl<string>;
  }

  export interface UserList{
    firstName:string ;
    lastName:string ;
    nationalCode: number;
}