import { Component, OnInit } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { environment } from 'src/environments/environment';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  imageUrl: string;
  currentUser: any;
  constructor(public auth: AuthService) {
    this.imageUrl = environment.imageUrl;
  }

  ngOnInit(): void {
    // if (
    //   this.auth.getDecodedAccessToken(localStorage.getItem('authToken') || '')
    // ) {
    //   this.currentUser = jwtDecode(localStorage.getItem('authToken') || '');
    // }
  }
  ngDoCheck(): void {
    if (
      this.auth.getDecodedAccessToken(localStorage.getItem('authToken') || '')
    ) {
      this.currentUser = jwtDecode(localStorage.getItem('authToken') || '');
    }
  }
}
