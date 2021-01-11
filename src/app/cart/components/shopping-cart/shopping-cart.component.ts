import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MockCartService } from '../../services/mock-cart.service';
import { ItemCarrito } from '../../clases/item-carrito';
import { Carrito } from '../../clases/carrito';
import { CarritoService } from '../../services/carrito.service';
import { DetalleCarrito } from '../../clases/detalle-carrito';
import { AuthService } from '../../../log-in/services/auth.service';
import { EnviarInfoCompraService } from 'src/app/user-options/user-profile/services/enviar-info-compra.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit {

  carrito: Carrito;
  totalProductos: number;
  mostrarCheckout:boolean=false;
  // item:ItemCarrito
  constructor(private carritoService: CarritoService,
               private _cartService:MockCartService, 
               private authService: AuthService,
               private enviarInfoCompra:EnviarInfoCompraService,
               private Router:Router,
               ) {
    this.carrito = new Carrito();
    
   }

  ngOnInit(): void {
    this.getCarrito();
    setTimeout(() => {
      this.getCarrito();
    }, 100);
    console.log(this.carrito);
       
    
 
    // this.items=JSON.parse(localStorage.getItem("Mi Carrito"));
    // console.log(this.items)

    // this._cartService.currentDataCart$.subscribe(x=>{
    //   if(x)
    //   {
    //     this.items = x;
    //     this.totalQuantity = x.length;
    //      this.totalPrice = x.reduce((sum, current) => sum + (current.producto.precio * current.cantidad), 0);
        
    //   }
    // })
    
  }

  getCarrito(): void {
    if (this.authService.isLoggedIn()) {
      this.carritoService.getCarrito().subscribe((response: any) => {
        this.carrito = response.carrito;
        console.log(this.carrito)
        this.totalProductos = this.carrito.items.length;
        /// envio la cantidad de producto al header para q muestre la notifiicacion
        setTimeout(() => {
            this.enviarInfoCompra.enviarCantidadProductosCarrito$.emit(this.totalProductos); 
          }, 100);
      });
    }  
   
  }
 
  eliminarItem(id?: number): void {
    let skuId = id.toString();

    this.carrito.items = this.carrito.items.filter((item: ItemCarrito) => id !== item.sku.id);

    this.carritoService.eliminarItem(skuId).subscribe(response => {
    
     this.getCarrito();
    });

  
  }

  decrementarCantidad(item: DetalleCarrito): void {
    let skuId = item.sku.id;
    
    this.carrito.items = this.carrito.items.map((item: DetalleCarrito) => {
      if (skuId == item.sku.id) {
        --item.cantidad;
      };
      return item;
    });
    if (item.cantidad == 0) {
      return this.eliminarItem(skuId);
    }
    console.log(item.cantidad);

    this.carritoService.actualizarCantidad(item.cantidad.toString(), skuId.toString()).subscribe(response => {
      
       this.getCarrito()
    });

      //para refrescar el componente y q se actualizen los nuevos valores
      // this.Router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      //   this.Router.navigate(['/shopping-cart']); 
      //   }); 
  }

  incrementarCantidad(item: DetalleCarrito): void {
    let skuId = item.sku.id;
    console.log(skuId)
    this.carrito.items = this.carrito.items.map((item: DetalleCarrito) => {
      if (skuId == item.sku.id) {
        ++item.cantidad;
      };
      return item;
    });

    this.carritoService.actualizarCantidad(item.cantidad.toString(), skuId.toString()).subscribe(response => {
      
     this.getCarrito();
    });
   
   
 
  }

  enviarInfoACheckout(){
    this.mostrarCheckout=true
    setTimeout(() => {
    console.log(this.mostrarCheckout)
      this.enviarInfoCompra.enviarMostrarCheckout$.emit(this.mostrarCheckout);
     
    }, 100);
   
  }

  /*
  ///inicio carrito de compras eliminar , sumar 
  // public remove(item:ItemCarrito){
  //   this._cartService.removeElementCart(item);
  // }
  // public  removeOne(item:ItemCarrito){
  //   this._cartService.removeOneElementCart(item)
  // }
  // public addOne(item:ItemCarrito){
  //   this._cartService.addOneElementCart(item)
  // }

//// fin carrito de compras eliminar sumar 


 closeIcon(){
  let icono=document.getElementById("close");
  icono.style.color="red"
 }
 */
}
