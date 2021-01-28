import { MedioPago } from './../../../admin-options/admin-ventas/clases/MedioPago';
import { Direccion } from './../../../log-in/clases/cliente/direccion';
import { Operacion } from './../../../admin-options/admin-ventas/clases/Operacion';
import { EnviarInfoCompraService } from './../../../user-options/user-profile/services/enviar-info-compra.service';
import { Cliente } from './../../../log-in/clases/cliente/cliente';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-stepper-cart',
  templateUrl: './stepper-cart.component.html',
  styleUrls: ['./stepper-cart.component.scss']
})
export class StepperCartComponent implements OnInit {
  clienteDireccion:any;
  pago:MedioPago;
  entrega:string;
  mostrarCheckout:boolean=false;
  mostrarConfirmacion:boolean=true;
  abriendoStep2:boolean;
  subscripcionInfoCompra : Subscription;

  /// para q el stepper sea lineal
  step1Completo:boolean=false;
  step2Completo:boolean=false;
  actualizarCarrito:boolean

  mostrarResumen:boolean
  mostrarStep1:boolean
  constructor(private enviarInfoCompra:EnviarInfoCompraService) { }

  ngOnInit(): void {
    this.mostrarStep1=true
    //// recibo del step 2 "checkout" la info cliente
    this.subscripcionInfoCompra=this.enviarInfoCompra.enviarCliente$.subscribe(dir=> {
       this.clienteDireccion=dir;
       console.log(this.clienteDireccion)
     })
    //// recibo del step 2 "checkout" la infoforma de entrega
    this.subscripcionInfoCompra=this.enviarInfoCompra.enviarEntrega$.subscribe(entrega=> {
       this.entrega=entrega;
       console.log(this.entrega)
     })
      //// recibo del step 2 "checkout" la info  forma de pago 
    this.subscripcionInfoCompra=this.enviarInfoCompra.enviarPago$.subscribe(pago=> {
       this.pago=pago;
       console.log(this.pago)
     })

    

    this.subscripcionInfoCompra=this.enviarInfoCompra.enviarMostrarConfirmacion$.subscribe(mostrarConfirmacion=> {
      this.mostrarConfirmacion=mostrarConfirmacion;
    })
    this.subscripcionInfoCompra=this.enviarInfoCompra.enviarMostrarCheckout$.subscribe(mostrarCheckout=> {
      this.mostrarCheckout=mostrarCheckout;
    })
    this.subscripcionInfoCompra=this.enviarInfoCompra.enviarStep2Completo$.subscribe(step2Completo=> {
      this.step2Completo=step2Completo;
      console.log(this.step2Completo)
    })
    this.subscripcionInfoCompra=this.enviarInfoCompra.enviarActualizarCarrito.subscribe(actualizarCarrito=> {
      this.actualizarCarrito=actualizarCarrito;
      this.mostrarResumen=false;
      this.mostrarResumen=true;
    })
    
  }
 recargarCarrito(){
 
  // if (!this.mostrarConfirmacion) {
  //   this.mostrarCheckout=true
  //   this.mostrarResumen=false;
  //  console.log(this.mostrarResumen)
  // }
  // if (this.mostrarCheckout) {
  //   this.mostrarConfirmacion=false
  //   this.mostrarResumen=false;
  //   // this.mostrarResumen=true;
  // }

  // this.mostrarResumen=false;
  // this.mostrarResumen=true;
 
 }
}
