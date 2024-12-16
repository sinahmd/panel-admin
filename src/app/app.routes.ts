import { RouterModule, Routes } from '@angular/router';
import { LogInComponent } from './pages/log-in/log-in.component';
import { NgModule } from '@angular/core';
import { AuthenticationGaurdService } from './core/auth/authentication.gaurd.service';
import { ListComponent } from './pages/users/list/list.component';
import { AddComponent } from './pages/users/add/add.component';
import { HomeComponent } from './home/home.component';
import { ProductListComponent } from './pages/products/product.list/product.list.component';
import { ProductAddComponent } from './pages/products/product.add/product.add.component';

export const routes: Routes = [
  { path: 'login', component: LogInComponent },
  { path: 'users', component: ListComponent },
  { path: 'users/add', component: AddComponent, canActivate: [AuthenticationGaurdService], data: { roles: 1} },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [AuthenticationGaurdService] },
  { path: 'products', component: ProductListComponent},
  { path: 'products/add', component: ProductAddComponent}
];
  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule {}