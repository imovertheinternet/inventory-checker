import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {ApiService} from "../_services/apiService";
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import {SocketioService} from "../socketio.service";

@Component({
  selector: 'app-spiritus',
  templateUrl: './spiritus.component.html',
  styleUrls: ['./spiritus.component.scss']
})
export class SpiritusComponent implements OnInit {
  // myWebSocket: WebSocketSubject<any> = webSocket('ws://localhost:3000');

  constructor(private socketService: SocketioService) {

  }

  ngOnInit() {
    // this.myWebSocket.asObservable().subscribe(dataFromServer => {
    //   console.log('some data from server', dataFromServer)
    // })

    this.socketService.setupSocketConnection();

    // this.apiService.getSpiritus().subscribe(res => console.log('subscirbe', res));
    // return this.http.get<any>('').subscribe(res => console.log('res', res));
  }

}
