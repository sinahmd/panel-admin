import { RouterModule, Routes } from '@angular/router';
import { LogInComponent } from './log-in/log-in.component';
import { NgModule } from '@angular/core';
import { AuthenticationGaurdService } from './services/authentication.gaurd.service';
import { ListComponent } from './users/list/list.component';
import { AddComponent } from './users/add/add.component';
import { HomeComponent } from './home/home.component';
import { EditComponent } from './users/edit/edit.component';

// export const routes: Routes = [
//     { path: 'login', component: LogInComponent },
//     { path: 'users', component: ListComponent, 
//     // canActivate: [AuthenticationGaurdService]
//    },
//     { path: 'users/add', component: AddComponent,data: {
//       roles: 1
//     },
//      canActivate: [AuthenticationGaurdService]
//      },
//      {path: 'user/edit:username', component: EditComponent},
//     // { path: 'users/edit/:id', component: UserEditComponent, canActivate: [AuthGuard] },
//     // { path: 'products', component: ProductListComponent },
//     // { path: 'products/add', component: ProductAddComponent, canActivate: [AuthGuard] },
//     { path: '', redirectTo: '/login', pathMatch: 'full' },
//     { path: 'home', component: HomeComponent, canActivate: [AuthenticationGaurdService] },
//   ];

export const routes: Routes = [
  { path: 'login', component: LogInComponent },
  { path: 'users', component: ListComponent },
  { path: 'users/add', component: AddComponent, canActivate: [AuthenticationGaurdService], data: { roles: 1} },
  { path: 'users/edit/:id', component: EditComponent, canActivate: [AuthenticationGaurdService] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [AuthenticationGaurdService] },
];
  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule {}