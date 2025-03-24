import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AvisService {
  private apiUrl = 'https://mind.alwaysdata.net/tp_api/api/avis.php'; 

  constructor(private http: HttpClient) {}

  getAvis(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  addAvis(ecole: any): Observable<any> {
    return this.http.post(this.apiUrl, ecole);
  }

deleteAvis(avisId: number): Observable<any> {
  const url = `${this.apiUrl}?id_avis=${avisId}`; 
  return this.http.delete(url);
}

}
