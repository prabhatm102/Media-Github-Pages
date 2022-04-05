import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import JWT from 'jwt-decode';
import { EMPTY, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private router: Router) {}

  isLoggedIn() {
    return localStorage.getItem('authToken');
  }

  logout() {
    localStorage.removeItem('authToken');
    this.router.navigate(['users/login']);
  }

  getDecodedAccessToken(token: string) {
    try {
      return JWT(token);
    } catch (Error) {
      return null;
    }
  }
}
