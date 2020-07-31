import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import {environment} from "../environments/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SocketioService {
  socket;
  constructor() {
    this.socket = io(environment.SOCKET_ENDPOINT)
  }

  setupSocketConnection() {
    this.socket.emit('test message', 'this is a test message event emiting from socketioservice.');
    this.socket.on('my broadcast', (data: string) => {
      console.log(data);
    })

  }

  spiritusMessages() {
    return Observable.create(observer => {
      this.socket.on('Spiritus Broadcast', msg => {
        observer.next(msg);
      });
    });

    // this.socket.on('Spiritus Broadcast', (data) => console.log('omg spirius is iw roking??', data));
    // return this.socket.on('Spiritus Broadcast', (data) => data);
    // this.socket.on('Spiritus Broadcast', (data) => { return data; });
  }
}
