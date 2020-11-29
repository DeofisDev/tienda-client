import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_BASE_URL } from 'src/app/config/config';
import { Categoria } from '../clases/categoria';
import { Producto } from '../clases/producto';
import { Subcategoria } from '../clases/subcategoria';

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {
url:string;
id:number;
  constructor(private http:HttpClient) { 
     this.url = `${API_BASE_URL}/api`

  }
  getProductosDestacados():Observable<Producto[]>{
    return this.http.get(`${this.url}/catalogo/destacados`).pipe( map( response => response as Producto[]));
  }

  getProductos(){
    return this.http.get(`${this.url}/productos`).pipe(map((resp:any) => {
      return resp.productos
    }))
  }

  getListaCategorias():Observable<Categoria[]>{
    return this.http.get(`${this.url}/categorias`).pipe( map( (response:any) => response.categorias as Categoria[]));
  }
  getSubcategoriasPorCategoria(categoriaId:number):Observable<any>{
    return this.http.get(`${this.url}/categorias/${categoriaId}/subcategorias`)
  }

  getRdoBusqueda(termino:string):Observable<Producto[]>{
    let parametros=new HttpParams();
    parametros=parametros.append("termino",termino);
    return this.http.get(`${this.url}/catalogo/buscar`,{params:parametros}).pipe(
      map(response=> response as Producto[])
    )
    
  }
  getUnidades():Observable<any>{
    return this.http.get(`${this.url}/productos/unidades-medida`);
  }
  getBrands():Observable<any>{
    return this.http.get(`${this.url}/productos/marcas`);
  }
  getInfoProducto(id:number):Observable<Producto>{
    
    return this.http.get(`${this.url}/catalogo/productos/ver/${id}`).pipe( map( (response:any) => response.producto as Producto));
  }

}
