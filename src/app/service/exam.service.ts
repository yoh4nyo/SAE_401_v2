import { HttpClient , HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExamService {
  private apiUrl = 'http://localhost/tp_api/api/exam.php';

  constructor(private http: HttpClient) {}


  addExam(exam: any): Observable<any> {
    return this.http.post(this.apiUrl, JSON.stringify(exam));
  }

  getExamById(id_exam: number): Observable<any> {
    return this.http.get(`${this.apiUrl}?id_exam=${id_exam}`);
  }

  getExams(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  deleteExams(ids: number[]): Observable<any> {
    const url = 'http://localhost/tp_api/api/exam.php';
    const options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: { ids } 
    };
    return this.http.delete(url, options);
  }

  updateExam(id: number, exam: any): Observable<any> {
    const url = `${this.apiUrl}?id_exam=${id}`; 
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(url, JSON.stringify(exam), { headers }); 
  }
}
