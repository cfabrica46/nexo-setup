import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';

import { FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { Navbar } from './shared/navbar/navbar';
import { Footer } from './shared/footer/footer';
import { ProductCard } from './shared/product-card/product-card';

@NgModule({
  declarations: [App, Navbar, Footer, ProductCard],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [provideBrowserGlobalErrorListeners(), provideHttpClient()],
  bootstrap: [App],
})
export class AppModule {}
