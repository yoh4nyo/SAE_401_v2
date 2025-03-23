// src/app/services/stats.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StatsData } from '../models/stats-data';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  private apiUrl = 'http://localhost/tp_api/api';  

  constructor(private http: HttpClient) {}

  getStats(candidatId: number): Observable<StatsData> {
    const params = new HttpParams().set('id', candidatId.toString());
    return this.http.get<StatsData>(`${this.apiUrl}/stats.php`, { params: params });
  }
}