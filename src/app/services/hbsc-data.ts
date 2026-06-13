import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HbscDataService {

  constructor(private http: HttpClient) {}

  getHbscData(): Observable<any> {
    return this.http.get('data/hbsc-data.json');
  }

  getChallenges(): Observable<any> {
    return this.http.get('data/challenges.json');
  }

  getBadges(): Observable<any> {
    return this.http.get('data/badges.json');
  }
}
