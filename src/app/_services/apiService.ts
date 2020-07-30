import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
// import {environment} from "../../environments/environment";

@Injectable()
export class ApiService {

  loading = false;

  constructor(private http: HttpClient) {
  }

  getSpiritus() {
    return this.http.get<any>('http://localhost:3000/api/spiritus');
  }

}
