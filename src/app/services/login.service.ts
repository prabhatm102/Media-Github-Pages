import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService extends DataService {
  constructor(http: HttpClient) {
    super('http://192.168.1.35:5000/api/logins', http);
  }
}
