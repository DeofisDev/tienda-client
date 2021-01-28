
import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnviarInfoCompraService {
  enviarCliente$ = new EventEmitter();
  enviarEntrega$= new EventEmitter();
  enviarPago$ =new EventEmitter();
  enviarRecargarCarrito$ = new EventEmitter();
  enviarMostrarCheckout$ =new EventEmitter();
  enviarMostrarConfirmacion$ =new EventEmitter();
  enviarCantidadProductosCarrito$ = new EventEmitter();
  enviarStep2Completo$ =new EventEmitter();
  enviarActualizarCarrito = new EventEmitter();
  enviarmostrarresumen$= new EventEmitter();
  // para avisar q llego el carrito al resumen  y asi se muestre el boton continuar en el checkout 
  llegoCarrito$ = new EventEmitter()
  constructor() { }
}