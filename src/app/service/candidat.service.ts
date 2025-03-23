import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CandidatService {
  private apiUrl = 'http://localhost/tp_api/api/candidat.php';

  constructor(private http: HttpClient) {}

  addCandidat(candidat: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.apiUrl, JSON.stringify(candidat), { headers });
  }

  getCandidatById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/candidat/${id}`);
  }
  getCandidat(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  deleteCandidats(ids: number[]): Observable<any> {
    const url = 'http://localhost/tp_api/api/candidat.php';
    const options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: { ids } 
    };
    return this.http.delete(url, options);
  }

  updateCandidat(id: number, candidat: any): Observable<any> {
    const url = `${this.apiUrl}?id_candid=${id}`; 
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(url, JSON.stringify(candidat), { headers }); 
  }

  
}
