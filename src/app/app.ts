import { Component, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('nexo-setup');

  constructor(private router: Router) {
    // Cada vez que se navega, la nueva página empieza desde arriba
    this.router.events
      .pipe(filter((evento) => evento instanceof NavigationEnd))
      .subscribe(() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' }));
  }
}
