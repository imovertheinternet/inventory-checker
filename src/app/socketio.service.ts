import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import {environment} from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class SocketioService {
  socket;
  constructor() { }

  setupSocketConnection() {
    this.socket = io(environment.SOCKET_ENDPOINT)
    this.socket.emit('test message', 'this is a test message event emiting from socketioservice.');
    this.socket.on('my broadcast', (data: string) => {
      console.log(data);
    })

    this.socket.on('Spiritus Broadcast', (data) => console.log('omg spirius is iw roking??', data));
  }
}
