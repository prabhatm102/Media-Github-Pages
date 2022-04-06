import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  constructor(private socket: Socket) {}
  // emit event
  joinRoom(userId: string) {
    this.socket.emit('joinRoom', userId);
  }

  // listen event
  OnFriendRequest() {
    return this.socket.fromEvent('friendRequest');
  }
  OnCancelRequest() {
    return this.socket.fromEvent('cancelRequest');
  }
}
