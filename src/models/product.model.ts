import { FormControl } from "@angular/forms";

export interface Product {
    id: FormControl<number>;
    name: FormControl<string>;
    code: FormControl<string>;
    weight: FormControl<number>;
  }
    