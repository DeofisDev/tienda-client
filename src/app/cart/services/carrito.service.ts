import { tap } from 'rxjs/operators';
import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_BASE_URL } from '../../config/config';
import { Observable, Subject } from 'rxjs';
import { Sku } from 'src/app/products/clases/sku';
import { Carrito } from '../clases/carrito';
import { DetalleCarrito } from '../clases/detalle-carrito';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  urlEndpoint: string;
  totalItems: number;
  @Output() totalItemsEmmiter: EventEmitter<number> = new EventEmitter();

  constructor(private http: HttpClient) {
    this.urlEndpoint = `${API_BASE_URL}/api`;
  }
  
  //**metodo para refrescar componente  */
 private _refreshNeeded$ =new Subject<void>();
 
 get refreshNeeded$ (){
   return this._refreshNeeded$
 }

  /**
   * Obtiene el carrito del perfil de la sesión actual.
   * @return Observable con el objeto JSON convertido a Carrito.
   */
  getCarrito(): Observable<any> {
    return this.http
    .get(`${this.urlEndpoint}/perfil/carrito`)
    .pipe(
      tap(
        ()=> {
          this._refreshNeeded$.next();
        }
      )
    );
  }

  /**
   * Agrega un nuevo item al carrito, en caso de que el producto ya se encuentre
   * en el carrito, suma en uno la cantidad del item.
   * @param skuId id del sku a agregar al carrito.
   * @return Observable con el objeto carrito.
   */
  agregarSkuAlCarrito(skuId: string): Observable<any> {
   
    const params = new HttpParams().set('skuId', skuId);

    ++this.totalItems;
    this.totalItemsEmmiter.emit(this.totalItems);
    
    return this.http.post(`${this.urlEndpoint}/carrito/item/agregar`, null, {params: params});
  }

  agregarItemLocal(sku:Sku, carrito:Carrito){
    let items=carrito.items
    console.log("producto agregado al carrito")
    let existeItem=false;
      
    for (let x = 0; x < items.length; x++) {
      if (sku.id===items[x].sku.id ) {
          items[x].cantidad = items[x].cantidad+1;
          existeItem=true;
          break;
      }else{
         existeItem=false
      }
    }
    if (!existeItem) {
      let detalle: DetalleCarrito = new DetalleCarrito();
      detalle.sku=sku;
      detalle.cantidad=1
      carrito.items.push(detalle)
    }
  }

  /**
   * Elimina un item del carrito y devuelve el mismo actualizado.
   * @param skuId number id del sku (item) que remover del carrito.
   */
  eliminarItem(skuId: string): Observable<any> {
    let parametros = new HttpParams();
    parametros = parametros.append('skuId', skuId);

    --this.totalItems;
    this.totalItemsEmmiter.emit(this.totalItems);

    return this.http
    .delete(`${this.urlEndpoint}/carrito/item/quitar`, {params: parametros})
    .pipe(
      tap(
        ()=> {
          this._refreshNeeded$.next();
        }
      )
    );
  }

  /**
   * Actualiza la cantidad de productos de un item, y devuelve el carrito actualizado.
   * @param cantidad number cantidad nueva del item.
   * @param skuId number id del producto al cual se debe cambiar la cantidad del item.
   */
  actualizarCantidad(cantidad: string, skuId: string): Observable<any> {
    const parametros = new HttpParams().set('skuId', skuId).set('cantidad', cantidad);

    return this.http
    .put(`${this.urlEndpoint}/carrito/item/actualizar`, null, {params: parametros}) ;
    

  }

  getTotalItems(): number {
    let total;
    this.getCarrito().subscribe(resp => {
      total = resp.carrito.items.length;
    });

    return total;
  }

  getMediosDePago():Observable<any>{
    return this.http.get(`${this.urlEndpoint}/medios-pago`)

  }
  getMedioDePago(id:number):Observable<any>{
    return this.http.get(`${this.urlEndpoint}/medios-pago/${id}`)

  }
}
