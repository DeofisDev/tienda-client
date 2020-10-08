import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Categoria } from '../clases/categoria';
import { Producto } from '../clases/producto';

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {
url:string
  constructor(private http:HttpClient) { 
    this.url="http://deofistienda-env.eba-zdhxpdjp.sa-east-1.elasticbeanstalk.com/api";

  }
  getProductosDestacados():Observable<Producto[]>{
    return this.http.get(`${this.url}/catalogo/destacados`).pipe( map( response => response as Producto[]));
  }

  getListaCategorias():Observable<Categoria[]>{
    return this.http.get(`${this.url}/catalogo/categorias`).pipe( map( response => response as Categoria[]));
  }

  getRdoBusqueda(termino:string):Observable<Producto[]>{
    let parametros=new HttpParams();
    parametros=parametros.append("termino",termino);
    return this.http.get(`${this.url}/catalogo/buscar`,{params:parametros}).pipe(
      map(response=> response as Producto[])
    )
    
  }

}
