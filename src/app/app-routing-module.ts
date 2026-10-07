import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

import { Home } from './pages/home/home';
import { Productos } from './pages/productos/productos';
import { Ofertas } from './pages/ofertas/ofertas';
import { Tienda } from './pages/tienda/tienda';
import { Contacto } from './pages/contacto/contacto';
import { MiCuenta } from './pages/mi-cuenta/mi-cuenta';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { NotFound } from './pages/not-found/not-found';

const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'productos',
    component: Productos,
  },
  {
    path: 'ofertas',
    component: Ofertas,
  },
  {
    path: 'tienda',
    component: Tienda,
  },
  {
    path: 'contacto',
    component: Contacto,
  },
  {
    path: 'mi-cuenta',
    component: MiCuenta,
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard],
  },
  {
    path: '**',
    component: NotFound,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
