import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  showHeader = true;

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      const routesSansHeader = ['/connexion', '/', '/accueil', '/accueil/avis',];
      this.showHeader = !routesSansHeader.includes(this.router.url);
    });
  }
}
