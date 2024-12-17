import { RouterModule, Routes } from '@angular/router';
import { LogInComponent } from './pages/log-in/log-in.component';
import { NgModule } from '@angular/core';
import { AuthenticationGaurdService } from './core/auth/authentication.gaurd.service';
import { ListComponent } from './pages/users/list/list.component';
import { ProductListComponent } from './pages/products/product.list/product.list.component';
import { UserFormComponent } from './pages/users/user.form/user.form.component';
import { ProductFormComponent } from './pages/products/product.form/product.form.component';

export const routes: Routes = [
  { path: 'login', component: LogInComponent },
  { path: 'users', component: ListComponent },
  { path: 'users/add', component: UserFormComponent, canActivate: [AuthenticationGaurdService], data: { roles: 1} },
  { path: 'users/edit/:id', component: UserFormComponent, canActivate: [AuthenticationGaurdService], data: { roles: 1 } },
  { path: 'products', component: ProductListComponent},
  { path: 'products/add', component: ProductFormComponent},
  { path: 'products/edit/:id', component: ProductFormComponent},
  { path: '**', redirectTo: '/login', pathMatch: 'full' }
];
  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule {}