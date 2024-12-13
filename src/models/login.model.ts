import { FormControl } from "@angular/forms";

export interface Login{
    username: FormControl<string>;
    password: FormControl<string>;
}