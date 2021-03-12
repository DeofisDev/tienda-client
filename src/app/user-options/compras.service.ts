import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { API_BASE_URL } from '../config/config';
import { Observable } from 'rxjs';
import { OperacionPago } from '../admin-options/admin-ventas/clases/OperacionPago';

@Injectable({
  providedIn: 'root'
})
export class ComprasService {

  url:string = API_BASE_URL + "/api";

  constructor( private http: HttpClient ) { }

  getVentasUser(){

    return this.http.get(`${this.url}/perfil/compras/historial`).pipe(map((resp:any) => {
        return resp.compras
    }))

  };

  getCompra(nroOperacion: number){

    return this.http.get(`${this.url}/perfil/compras/${nroOperacion}`).pipe(map((resp:any) => {
      return resp
    }))

  };

  /**
   * Método que se encarga de consumir la API para completar el pago de una operación dada, para el
   * usuario logueado en el sistema.
   * @param nroOperacion : number, número de operación al que se desea completar el pago del usuario logueado.
   */
   completarPago(nroOperacion: number): Observable<OperacionPago> {
    return this.http.post(`${this.url}/perfil/compras/${nroOperacion}/completar/pago`, null).pipe(
      map((resp: any) => resp.pago as OperacionPago)
    );
  }
  
}
