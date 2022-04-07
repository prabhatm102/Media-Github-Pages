import { Component, OnInit, SimpleChanges } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { SocketService } from 'src/app/services/socket.service';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../../shared/auth.service';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  imageUrl: string;
  currentUser: any;
  constructor(public auth: AuthService, private socket: SocketService) {
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
      // this.socket.joinRoom(this.currentUser?._id);
    }
  }
}
