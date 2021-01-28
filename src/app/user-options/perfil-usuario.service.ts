import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { API_BASE_URL } from '../config/config';
import { Cliente } from '../log-in/clases/cliente/cliente';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PerfilUsuarioService {
  url:string = API_BASE_URL + "/api";

  constructor(private http: HttpClient) { }

  
  getPerfilCliente(): Observable<Cliente> {
    return this.http.get(`${this.url}/perfil`).pipe(map((resp:any) => {
      console.log(resp)
      return resp
  }));
  }
}
