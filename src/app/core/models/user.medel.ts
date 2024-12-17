import { FormControl } from "@angular/forms";

export interface User {
    id?: number;
    firstName:FormControl<string>;
    lastName: FormControl<string>;
    role: number;
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