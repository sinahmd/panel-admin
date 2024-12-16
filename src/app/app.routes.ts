import { RouterModule, Routes } from '@angular/router';
import { LogInComponent } from './pages/log-in/log-in.component';
import { NgModule } from '@angular/core';
import { AuthenticationGaurdService } from './core/auth/authentication.gaurd.service';
import { ListComponent } from './pages/users/list/list.component';
import { AddComponent } from './pages/users/add/add.component';
import { ProductListComponent } from './pages/products/product.list/product.list.component';
import { ProductAddComponent } from './pages/products/product.add/product.add.component';
import { EditComponent } from './pages/users/edit/edit.component';
import { ProductEditComponent } from './pages/products/product.edit/product.edit.component';

export const routes: Routes = [
  { path: 'login', component: LogInComponent },
  { path: 'users', component: ListComponent },
  { path: 'users/add', component: AddComponent, canActivate: [AuthenticationGaurdService], data: { roles: 1} },
  { path: 'users/edit/:id', component: EditComponent, canActivate: [AuthenticationGaurdService], data: { roles: 1 } },
  { path: 'products', component: ProductListComponent},
  { path: 'products/add', component: ProductAddComponent},
  { path: 'products/edit/:id', component: ProductEditComponent},
  { path: '**', redirectTo: '/login', pathMatch: 'full' }
];
  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule {}