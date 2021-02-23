import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpParams, HttpRequest } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  url: string = API_BASE_URL + "/api";

  constructor( private http: HttpClient) { }


  getUsuarios(){

    return this.http.get(`${this.url}/usuarios`).pipe(map((resp:any) => {
      return resp
    }))

  };

  getRolesUsuarios(){

    return this.http.get(`${this.url}/usuarios/roles`).pipe(map((resp:any) => {
      return resp
    }))

  };

  habilitarUsuario( mail: string ){

    

  }


}
