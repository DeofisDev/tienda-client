import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Carrito } from 'src/app/cart/clases/carrito';
import { CarritoService } from 'src/app/cart/services/carrito.service';
import { AuthService } from 'src/app/log-in/services/auth.service';
import { EnviarInfoCompraService } from 'src/app/user-options/user-profile/services/enviar-info-compra.service';

import { Router } from '@angular/router';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-resumen-carrito',
  templateUrl: './resumen-carrito.component.html',
  styleUrls: ['./resumen-carrito.component.scss']
})
export class ResumenCarritoComponent implements OnInit ,  OnDestroy{
  carrito: Carrito;
  totalProductos: number;
  totalPrice:number ;
  totalQuantity:number;
  costoDeEnvio = 0;
  llegoCarrito:boolean
  @Input() actualizarCarrito:boolean;
  constructor(private carritoService: CarritoService,
              private authService: AuthService,
              private enviarInfoCompra:EnviarInfoCompraService,
              private Router:Router, ) {
      this.carrito = new Carrito();
     }
  ngOnDestroy(): void {
    console.log("destruyendoresumente")
  }

  ngOnInit(): void {
    this.getCarrito();
    
    if (this.actualizarCarrito) {
      this.getCarrito();
    }
  }
  getCarrito(): void {
    if (this.authService.isLoggedIn()) {
      this.carritoService.getCarrito().subscribe((response: any) => {
        this.carrito = response.carrito;
        this.llegoCarrito=true;
        setTimeout(() => {
          console.log(this.llegoCarrito)
          this.enviarInfoCompra.llegoCarrito$.emit(this.llegoCarrito);
         
        }, 100);

        this.totalProductos = this.carrito.items.length;
      });
    }
  }

}
