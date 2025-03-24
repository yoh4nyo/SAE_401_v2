import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private apiService: ApiService 
  ) { }

  logout() {
    const options = {
      withCredentials: true,
      responseType: 'json' as const
    };

    this.apiService.logout(); 

    return this.http.get('https://mind.alwaysdata.net/tp_api/api/logout.php', options).pipe(
      tap((response: any) => {
        if (response.success) {
          this.router.navigate(['/connexion']);
        } else {
          console.error('Erreur lors de la déconnexion :', response.message);
          this.router.navigate(['/connexion']); 
        }
      }),
      catchError((error) => {
        console.error('Erreur lors de la déconnexion', error);
        this.router.navigate(['/connexion']); 
        return of(null);
      })
    ).subscribe();
  }
}