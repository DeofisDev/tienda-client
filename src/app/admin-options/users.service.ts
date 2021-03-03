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
      return resp.usuarios
    }))

  };

  getRolesUsuarios(){

    return this.http.get(`${this.url}/usuarios/roles`).pipe(map((resp:any) => {
      return resp.roles
    }))

  };

  habilitarUsuario( mail: string ){

    let parametros = new HttpParams();
    parametros = parametros.append('usuarioEmail', mail);

    return this.http.post(`${this.url}/usuarios/habilitar`, null, {params: parametros}).pipe(map((resp: any) => {
      return resp
    }));

  };

  deshabilitarUsuario( mail: string ){

    let parametros = new HttpParams();
    parametros = parametros.append('usuarioEmail', mail);

    return this.http.post(`${this.url}/usuarios/deshabilitar`, null, {params: parametros}).pipe(map((resp: any) => {
      return resp
    }));

  };

  cambiarRolUsuario(rolDto: any){

    return this.http.post(`${this.url}/usuarios/cambiar-rol`, rolDto).pipe(map((resp: any) => {
      return resp;
    }))
  };

  registroDeCambiosDeRol(){

    return this.http.get(`${this.url}/usuarios/registros/cambio-rol`).pipe(map((resp:any) => {
      return resp.registros
    }))

  };

  registroDeCambiosDeEstadosUsuarios(){

    return this.http.get(`${this.url}/usuarios/registros/habilitacion`).pipe(map((resp:any) => {
      return resp.registros
    }))

  }


}
