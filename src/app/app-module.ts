import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';

import { FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { Navbar } from './shared/navbar/navbar';
import { Footer } from './shared/footer/footer';
import { ProductCard } from './shared/product-card/product-card';
import { Home } from './pages/home/home';
import { Productos } from './pages/productos/productos';
import { Ofertas } from './pages/ofertas/ofertas';
import { Tienda } from './pages/tienda/tienda';
import { Contacto } from './pages/contacto/contacto';
import { Login } from './pages/login/login';
import { MiCuenta } from './pages/mi-cuenta/mi-cuenta';
import { Dashboard } from './pages/dashboard/dashboard';
import { NotFound } from './pages/not-found/not-found';
import { ProductSkeleton } from './shared/product-skeleton/product-skeleton';

@NgModule({
  declarations: [
    App,
    Navbar,
    Footer,
    ProductCard,
    Home,
    Productos,
    Ofertas,
    Tienda,
    Contacto,
    Login,
    MiCuenta,
    Dashboard,
    NotFound,
    ProductSkeleton,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [provideBrowserGlobalErrorListeners(), provideHttpClient()],
  bootstrap: [App],
})
export class AppModule {}
