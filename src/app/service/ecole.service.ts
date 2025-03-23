import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EcoleService {
  private apiUrl = 'http://localhost/tp_api/api/ecole.php'; 

  constructor(private http: HttpClient) {}

  getEcoles(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  addEcole(ecole: any): Observable<any> {
    return this.http.post(this.apiUrl, ecole);
  }

  deleteEcoles(ids: number[]): Observable<any> {
    const url = 'http://localhost/tp_api/api/ecole.php';
    const options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: { ids } 
    };
    return this.http.delete(url, options);
  }

  updateEcole(id: number, ecole: any): Observable<any> {
    const url = `${this.apiUrl}?id_ecole=${id}`; 
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(url, JSON.stringify(ecole), { headers }); 
  }
}