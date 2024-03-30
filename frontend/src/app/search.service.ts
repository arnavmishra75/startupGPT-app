import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private apiUrl = 'http://127.0.0.1:5000/search'; 

  constructor(private http: HttpClient) {}

  search(query: string) {
    return this.http.post<any>('http://127.0.0.1:5000/search', { query });
  }
  
  gsearch(query: string) {
    return this.http.post<any>('http://127.0.0.1:5000/gsearch', { query });
  }
}