import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  private apiUrl = 'http://localhost/tp_api/api/login.php';
  private isLoggedInUser = false;
  private userRole = '';
  private authToken = ''; 

  constructor(private http: HttpClient) {
    this.isLoggedInUser = localStorage.getItem('isLoggedIn') === 'true';
    this.userRole = localStorage.getItem('userRole') || '';
    this.authToken = localStorage.getItem('authToken') || ''; 
  }

  login(email: string, password: string): Observable<any> {
    const loginData = { email, password };

    return this.http.post<any>(this.apiUrl, loginData);
  }

  setLoggedIn(value: boolean): void {
    this.isLoggedInUser = value;
    localStorage.setItem('isLoggedIn', value.toString()); 
  }

  isLoggedIn(): boolean {
    return this.isLoggedInUser;
  }

  setRole(role: string): void {
    this.userRole = role;
    localStorage.setItem('userRole', role); 
  }

  getRole(): string {
    return this.userRole;
  }

    setAuthToken(token: string): void {
    this.authToken = token;
    localStorage.setItem('authToken', token); 
  }

  getAuthToken(): string {
    return this.authToken;
  }

  logout(): void {
    this.isLoggedInUser = false;
    this.userRole = '';
    this.authToken = '';
    localStorage.removeItem('isLoggedIn'); 
    localStorage.removeItem('userRole');   
    localStorage.removeItem('authToken');
  }
}