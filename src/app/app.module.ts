import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SpiritusComponent } from './spiritus/spiritus.component';
import {ApiService} from "./_services/apiService";
import {HttpClientModule} from "@angular/common/http";
import {SocketioService} from "./socketio.service";

@NgModule({
  declarations: [
    AppComponent,
    SpiritusComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [ApiService, SocketioService],
  bootstrap: [AppComponent]
})
export class AppModule { }
