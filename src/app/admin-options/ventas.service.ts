import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { API_BASE_URL } from '../config/config';


@Injectable({
  providedIn: 'root'
})
export class VentasService {

  url:string = API_BASE_URL + "/api";

  constructor( private http: HttpClient ) { }


  getVentas(){
    let arrayAux = [];
    return this.http.get(`${this.url}/ventas`).pipe(map((resp:any) => {
      for (let i = 0; i < resp.ventas.length; i++) {
        if (resp.ventas[i].estado !== "PAYMENT_PENDING") {
          arrayAux.push(resp.ventas[i])
        }
        
      }

      return arrayAux;
    }))
  };


  updateVentaSent(idVenta){
    
    let parametro = new HttpParams();
    parametro = parametro.append("nroOperacion", idVenta);

    return this.http.post(`${this.url}/operaciones/enviar`, null, {params: parametro});
  };

  cancelVenta(idVenta){

    let parametro = new HttpParams();
    parametro = parametro.append("nroOperacion", idVenta);

    return this.http.post(`${this.url}/operaciones/cancelar`, null, {params: parametro});

  }

}
