import { FormControl } from "@angular/forms";

export interface Product {
    id: number;
    name: FormControl<string>;
    code: FormControl<string>;
    weight: FormControl<number>;
  }
    