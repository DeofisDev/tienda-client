import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpParams, HttpRequest } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  url: string = API_BASE_URL + "/api";

  constructor( private http: HttpClient ) { }


  getClientes(){

    return this.http.get(`${this.url}/usuarios/clientes`).pipe(map((resp: any) => {
      return resp.clientes
    }))

  };

}
