import { PerfilUsuarioService } from './../../../../user-options/perfil-usuario.service';
import { MedioPago } from './../../../../admin-options/admin-ventas/clases/MedioPago';
import { Cliente } from './../../../../log-in/clases/cliente/cliente';
import { Direccion } from './../../../../log-in/clases/cliente/direccion';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MockCartService } from 'src/app/cart/services/mock-cart.service';
import { CarritoService } from '../../../services/carrito.service';
import { DetalleCarrito } from '../../../clases/detalle-carrito';
import { AuthService } from '../../../../log-in/services/auth.service';
import { Router } from '@angular/router';
import { Carrito } from 'src/app/cart/clases/carrito';
import { CatalogoService } from 'src/app/products/services/catalogo.service';
import {FormGroup, FormBuilder, Validators, RequiredValidator} from '@angular/forms';
import { Pais } from 'src/app/log-in/clases/cliente/pais';
import { Estado } from 'src/app/log-in/clases/cliente/estado';
import { Ciudad } from 'src/app/log-in/clases/cliente/ciudad';
import { EnviarInfoCompraService } from 'src/app/user-options/user-profile/services/enviar-info-compra.service';
import { Input } from '@angular/core';
import { PerfilClienteService } from 'src/app/user-options/user-profile/services/perfil-cliente.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy{
  @Input() abriendoStep2:boolean;
  @Input() actualizarCarrito:boolean;
  @Input() mostrarResumen:boolean;
  carrito: Carrito;
  infoCliente:any;
  totalProductos: number;
  totalPrice:number ;
  totalQuantity:number;
  costoDeEnvio:number=0;
  mostrarEfvo:boolean=true;
  formEntrega:FormGroup;
  envioADomicilio:boolean = false;
  nuevaDireccion:boolean=false;
  paises:Pais[];
  estados:Estado[];
  ciudades:Ciudad[];
  paisSeleccionado:Pais;
  mediosDePago:MedioPago[];
  // direccionEnvio:Direccion;
  clienteDireccion:any;
  entrega:any;
  direccionUsuario:Direccion;
  direccionTienda:Direccion
  pago:MedioPago;
  msjCamposIncompletos:boolean=false;

  /// dato que envio para que se cierre el componente al ir atras
  mostrarCheckout:boolean
  mostrarConfirmacion:boolean

  /// para saber si llego el carrito al resumen y mostrar el boton continuar 
  llegoCarrito:boolean
  subscripcionInfoCompra : Subscription;

  /// para habilitar el step  3
  step2Completo:boolean=false;
  

  // para habilitar el boton 
  formValido:boolean=false

  /// para ver que form mostrar de direccion
  tieneDireccion:boolean

  /// msje alerta que el form no esta completo 
  mostrarMsje:boolean=false
  mostrarMsjeEnvio:boolean=false
  guardarDireccionFacturacion:boolean=false;

  /// para guardar la direccion de facturacion en el perfil del usuario q no tiene 
  direccionPerfil:Direccion;
  constructor(private carritoService: CarritoService,
              private fb:FormBuilder,
              private perfilClienteService:PerfilClienteService,
              private authService: AuthService,
              private Router:Router,
              private enviarInfoCompra:EnviarInfoCompraService,
              private catalogoservice:CatalogoService,
              ) { 
            this.carrito = new Carrito();
            this.pago = new MedioPago();
            this.direccionTienda = new Direccion();
            this.direccionTienda.ciudad={id:815, nombre:"Córdoba"};
            this.direccionTienda.ciudad.nombre="Córdoba";
            this.direccionUsuario = new Direccion();
  }

  ngOnInit(): void {
    ///inicializar el fomulario
 
    this.getCarrito(); 
    this.getMediosDePago();
    this.getPerfilCliente();
    this.getPaises();
    this.crearForm(); 
    console.log(this.actualizarCarrito)
   
    //// recibo del componente resumen  si llego el carrito para mostrar el bton
    this.subscripcionInfoCompra=this.enviarInfoCompra.llegoCarrito$.subscribe(resp=> {
       this.llegoCarrito=resp;
     })
  
 
  }

  ngOnDestroy():void{
    console.log("cerrando comp 2 ")
  }
  

  getCarrito(): void {
    if (this.authService.isLoggedIn()) {
      this.carritoService.getCarrito().subscribe((response: any) => {
        this.carrito = response.carrito;
        this.totalProductos = this.carrito.items.length;
      });
    }
  }

  /// este método se activa cuando elijo la opción de envío a domicilio ,
  // me muestra la direcc del perfil y me da la opcion de editarla, tambien oculta la forma de pago en efvo 
  showProfileAdress(){
    this.envioADomicilio=true
    if (this.tieneDireccion) {
      this.formEntrega.get('direccion.calle').clearValidators();
      this.formEntrega.get('direccion.numeroCalle').clearValidators();
      this.formEntrega.get('direccion.codigoPostal').clearValidators();
      this.formEntrega.get('direccion.ciudad').clearValidators();
      this.formEntrega.get('direccion.pais').clearValidators();
      this.formEntrega.get('direccion.estado').clearValidators();
      this.formEntrega.get('direccion.calle').updateValueAndValidity();
      this.formEntrega.get('direccion.numeroCalle').updateValueAndValidity();
      this.formEntrega.get('direccion.codigoPostal').updateValueAndValidity();
      this.formEntrega.get('direccion.ciudad').updateValueAndValidity();
      this.formEntrega.get('direccion.pais').updateValueAndValidity();
      this.formEntrega.get('direccion.estado').updateValueAndValidity();
  
      this.formEntrega.get('direccionFacturacion.calle').clearValidators();
      this.formEntrega.get('direccionFacturacion.numeroCalle').clearValidators();
      this.formEntrega.get('direccionFacturacion.codigoPostal').clearValidators();
      this.formEntrega.get('direccionFacturacion.ciudad').clearValidators();
      this.formEntrega.get('direccionFacturacion.pais').clearValidators();
      this.formEntrega.get('direccionFacturacion.estado').clearValidators();
      this.formEntrega.get('direccionFacturacion.calle').updateValueAndValidity();
      this.formEntrega.get('direccionFacturacion.numeroCalle').updateValueAndValidity();
      this.formEntrega.get('direccionFacturacion.codigoPostal').updateValueAndValidity();
      this.formEntrega.get('direccionFacturacion.ciudad').updateValueAndValidity();
      this.formEntrega.get('direccionFacturacion.pais').updateValueAndValidity();
      this.formEntrega.get('direccionFacturacion.estado').updateValueAndValidity();
    }
   

     let paypal = document.getElementById("2") as HTMLInputElement;
        
        this.formEntrega.get("formaDePago").setValue(2)
        setTimeout(() => {
          paypal.checked=true;
        }, 100);
     let efvo= document.getElementById("1") as HTMLInputElement;
      this.mostrarEfvo=false;
      
      efvo.style.display="none"
      this.formValido=false


    let inputEnvio=document.getElementById("deliver") as HTMLInputElement;
    let inputEntrega=document.getElementById("entrega") as HTMLInputElement;
    if(inputEnvio.checked){
      if (!this.formEntrega.invalid){
        this.msjCamposIncompletos=true;
        this.formValido=false
       }
    }
    if (this.tieneDireccion== false) {
      this.formEntrega.get('direccionFacturacion.calle').setValidators(Validators.required);
      this.formEntrega.get('direccionFacturacion.nro').setValidators(Validators.required);
      this.formEntrega.get('direccionFacturacion.cp').setValidators(Validators.required);
      this.formEntrega.get('direccionFacturacion.ciudad').setValidators(Validators.required);
      this.formEntrega.get('direccionFacturacion.pais').setValidators(Validators.required);
      this.formEntrega.get('direccionFacturacion.estado').setValidators(Validators.required);
      this.formEntrega.get('direccionFacturacion.calle').updateValueAndValidity();
      this.formEntrega.get('direccionFacturacion.nro').updateValueAndValidity();
      this.formEntrega.get('direccionFacturacion.cp').updateValueAndValidity();
      this.formEntrega.get('direccionFacturacion.ciudad').updateValueAndValidity();
      this.formEntrega.get('direccionFacturacion.pais').updateValueAndValidity();
      this.formEntrega.get('direccionFacturacion.estado').updateValueAndValidity();

      this.formEntrega.get('direccion.calle').clearValidators();
      this.formEntrega.get('direccion.nro').clearValidators();
      this.formEntrega.get('direccion.cp').clearValidators();
      this.formEntrega.get('direccion.ciudad').clearValidators();
      this.formEntrega.get('direccion.pais').clearValidators();
      this.formEntrega.get('direccion.estado').clearValidators();
      this.formEntrega.get('direccion.calle').updateValueAndValidity();
      this.formEntrega.get('direccion.nro').updateValueAndValidity();
      this.formEntrega.get('direccion.cp').updateValueAndValidity();
      this.formEntrega.get('direccion.ciudad').updateValueAndValidity();
      this.formEntrega.get('direccion.pais').updateValueAndValidity();
      this.formEntrega.get('direccion.estado').updateValueAndValidity();

  
    }
  }
  ocultarFormDireccion(){
    let inputOcultar = document.getElementById("repetir") as HTMLInputElement
    if (inputOcultar.checked) {
      this.formEntrega.get('direccion.calle').clearValidators();
      this.formEntrega.get('direccion.numeroCalle').clearValidators();
      this.formEntrega.get('direccion.codigoPostal').clearValidators();
      this.formEntrega.get('direccion.ciudad').clearValidators();
      this.formEntrega.get('direccion.pais').clearValidators();
      this.formEntrega.get('direccion.estado').clearValidators();
      this.formEntrega.get('direccion.calle').updateValueAndValidity();
      this.formEntrega.get('direccion.numeroCalle').updateValueAndValidity();
      this.formEntrega.get('direccion.codigoPostal').updateValueAndValidity();
      this.formEntrega.get('direccion.ciudad').updateValueAndValidity();
      this.formEntrega.get('direccion.pais').updateValueAndValidity();
      this.formEntrega.get('direccion.estado').updateValueAndValidity();
    
      document.getElementById("campo-ocultar").style.display="none";
      this.guardarDatos()

    }else{
      console.log("deshabilidndo")
      document.getElementById("campo-ocultar").style.display="block";
      document.getElementById("btn-guardar-envio").style.display="block";
      this.formEntrega.get('direccion.calle').setValidators(Validators.required);
      this.formEntrega.get('direccion.numeroCalle').setValidators(Validators.required);
      this.formEntrega.get('direccion.codigoPostal').setValidators(Validators.required);
      this.formEntrega.get('direccion.ciudad').setValidators(Validators.required);
      this.formEntrega.get('direccion.pais').setValidators(Validators.required);
      this.formEntrega.get('direccion.estado').setValidators(Validators.required);
      this.formEntrega.get('direccion.calle').updateValueAndValidity();
      this.formEntrega.get('direccion.numeroCalle').updateValueAndValidity();
      this.formEntrega.get('direccion.codigoPostal').updateValueAndValidity();
      this.formEntrega.get('direccion.ciudad').updateValueAndValidity();
      this.formEntrega.get('direccion.pais').updateValueAndValidity();
      this.formEntrega.get('direccion.estado').updateValueAndValidity();
      this.guardarDatos()  
      this.mostrarMsjeEnvio=false;
      this.formValido=false    
    }
  }
  // se activa cuando toco el boton de editar la direccion de envio
  mostrarFormNewAdress(){
    this.formEntrega.controls.direccion.enable();
    this.nuevaDireccion=true;
    let dirPerfil = document.getElementById("dir-perfil");
    dirPerfil.style.display="none";
    this.formEntrega.get('direccion.calle').setValue("");
    this.formEntrega.get('direccion.numeroCalle').setValue("");
    this.formEntrega.get('direccion.codigoPostal').setValue("");
    this.formEntrega.get('direccion.ciudad').setValue("");
    this.formEntrega.get('direccion.pais').setValue("");
    this.formEntrega.get('direccion.estado').setValue("");
    this.formEntrega.get('direccion.calle').setValidators(Validators.required);
    this.formEntrega.get('direccion.numeroCalle').setValidators(Validators.required);
    this.formEntrega.get('direccion.codigoPostal').setValidators(Validators.required);
    this.formEntrega.get('direccion.ciudad').setValidators(Validators.required);
    this.formEntrega.get('direccion.pais').setValidators(Validators.required);
    this.formEntrega.get('direccion.estado').setValidators(Validators.required);
    this.formValido=false
  }
  /// muestro la direccion del local cuando eligen la opcion de retiro personalmente
  showAdress(){
    //cambio los validadores  de los campos de direccion de envio para q no sean obligatorios
  
 
    this.envioADomicilio=false;
    this.nuevaDireccion=false; //para q se oculte el form de nueva direccion
    this.costoDeEnvio=0;

    let paypal = document.getElementById("2") as HTMLInputElement;
    let efvo = document.getElementById("1") as HTMLInputElement;
    efvo.style.display="initial"
      // paypal.checked=false;
      // efvo.disabled=false;
      // efvo.style.display="block";
      // efvo.checked=true
    
    this.mostrarEfvo=true;
        
  }
  // para obtener todos los medios de pago
 
  getMediosDePago(){
    this.carritoService.getMediosDePago().subscribe((response: any) => {
      this.mediosDePago=response.mediosPago;
    });
    
  }
   /// para el medio de pago elegido 
  getMedioDePago(id:number){
    this.carritoService.getMedioDePago(id).subscribe((response: any) => {
      this.pago=response.medioPago;
    });
  }
  cerrarComponente(){
    this.mostrarCheckout=false
    setTimeout(() => {
      this.enviarInfoCompra.enviarMostrarCheckout$.emit(this.mostrarCheckout);
    }, 100);
  }
  guardarDireccion(){
    if (this.formEntrega.invalid){
      console.log("invalidoformmm")
    if (this.calleInvalidaFacturacion ||this.nroInvalidoFacturacion
      || this.cpInvalidoFacturacion || this.ciudadInvalidaFacturacion ||this.paisInvalidoFacturacion ||this.estadoInvalidoFacturacion ) {
    this.mostrarMsje=true;
   }else{/// espues de editar cuando pongo guardar me entra aca 
    this.formEntrega.controls.direccionFacturacion.disable();
    this.mostrarMsje=false;
    document.getElementById("msje-btn-form-facturacion").style.display="none";
    document.getElementById("edit-facturacion").style.display="block"
   }
   
   return this.formEntrega.markAllAsTouched();
  }else{
    this.mostrarMsje=false;
    document.getElementById("msje-btn-form-facturacion").style.display="none";
    document.getElementById("edit-facturacion").style.display="block"
      ///muestro el form de envio, y si lo muestro lo pongo con validadores required
      this.guardarDireccionFacturacion=true;
      this.formEntrega.controls.direccionFacturacion.disable();
      this.formEntrega.get('direccion.calle').setValidators(Validators.required);
      this.formEntrega.get('direccion.numeroCalle').setValidators(Validators.required);
      this.formEntrega.get('direccion.codigoPostal').setValidators(Validators.required);
      this.formEntrega.get('direccion.ciudad').setValidators(Validators.required);
      this.formEntrega.get('direccion.pais').setValidators(Validators.required);
      this.formEntrega.get('direccion.estado').setValidators(Validators.required);
      this.formEntrega.get('direccion.calle').updateValueAndValidity();
      this.formEntrega.get('direccion.numeroCalle').updateValueAndValidity();
      this.formEntrega.get('direccion.codigoPostal').updateValueAndValidity();
      this.formEntrega.get('direccion.ciudad').updateValueAndValidity();
      this.formEntrega.get('direccion.pais').updateValueAndValidity();
      this.formEntrega.get('direccion.estado').updateValueAndValidity();
  }   
    
   
  }
  guardarDatos(){
    /// primero em fijo si es valido el form o no 
    if (this.formEntrega.invalid){
      this.mostrarMsjeEnvio=true
      this.step2Completo=false;
      this.formValido=false;
     if (this.calleInvalida ||this.nroInvalido
      || this.cpInvalido || this.ciudadInvalida ||this.paisInvalido ||this.estadoInvalido ) {
     this.mostrarMsjeEnvio=true
     this.formValido=false
     }
      
      if(this.formEntrega.controls.formaDeEntrega?.value == "Retiro personalmente" ){
        /// si elije retiro en tienda saco lso validadores de la direccion
        this.formEntrega.get('direccion.calle').clearValidators();
        this.formEntrega.get('direccion.numeroCalle').clearValidators();
        this.formEntrega.get('direccion.codigoPostal').clearValidators();
        this.formEntrega.get('direccion.ciudad').clearValidators();
        this.formEntrega.get('direccion.pais').clearValidators();
        this.formEntrega.get('direccion.estado').clearValidators();
        this.formEntrega.get('direccion.calle').updateValueAndValidity();
        this.formEntrega.get('direccion.numeroCalle').updateValueAndValidity();
        this.formEntrega.get('direccion.codigoPostal').updateValueAndValidity();
        this.formEntrega.get('direccion.ciudad').updateValueAndValidity();
        this.formEntrega.get('direccion.pais').updateValueAndValidity();
        this.formEntrega.get('direccion.estado').updateValueAndValidity();
         this.clienteDireccion=this.formEntrega.controls.direccion.value
         this.entrega=this.formEntrega.controls.formaDeEntrega?.value;
         let idPago =this.formEntrega.controls.formaDePago?.value;
          setTimeout(() => {
          this.getMedioDePago(idPago);
          
          }, 150);
          // this.formEntrega.disable();
          console.log(this.formEntrega);
          this.mostrarConfirmacion=true;
        
          setTimeout(() => {
            this.enviarInfoAConfirmData() 
          }, 1100);
        /// envio la direccion de facturacion, si tiene , al perfil 
        this.enviarDireccionPerfil()
      }
      return this.formEntrega.markAllAsTouched();
    }else{
      this.step2Completo=true;
      this.formValido=true;
      this.mostrarMsjeEnvio=false
     
      this.enviarInfoCompra.enviarStep2Completo$.emit(this.step2Completo);
    /// guardo las vriables con la info que voy a enviar al siguiente paso : direccion, forma de entrega y de pago 
    /** para la forma de entrega me fijo si tengo q poner la direccion del local, la del perfil o la nueva  */
   
      if(this.formEntrega.controls.formaDeEntrega?.value == "Retiro personalmente" ){
      
        this.formEntrega.get('direccion.calle').setValue("Av Calle");
        this.formEntrega.get('direccion.numeroCalle').setValue("4678");
        this.formEntrega.get('direccion.codigoPostal').setValue("08007");
        this.formEntrega.get('direccion.ciudad').setValue(this.direccionTienda.ciudad);
        this.formEntrega.get('direccion.pais').setValue("");
        this.formEntrega.get('direccion.estado').setValue("");
        /// si elije retiro en tienda saco lso validadores de la direccion
        this.formEntrega.get('direccionFacturacion.calle').clearValidators();
        this.formEntrega.get('direccionFacturacion.numeroCalle').clearValidators();
        this.formEntrega.get('direccionFacturacion.codigoPostal').clearValidators();
        this.formEntrega.get('direccionFacturacion.ciudad').clearValidators();
        this.formEntrega.get('direccionFacturacion.pais').clearValidators();
        this.formEntrega.get('direccionFacturacion.estado').clearValidators();
        this.formEntrega.get('direccionFacturacion.calle').updateValueAndValidity();
        this.formEntrega.get('direccionFacturacion.numeroCalle').updateValueAndValidity();
        this.formEntrega.get('direccionFacturacion.codigoPostal').updateValueAndValidity();
        this.formEntrega.get('direccionFacturacion.ciudad').updateValueAndValidity();
        this.formEntrega.get('direccionFacturacion.pais').updateValueAndValidity();
        this.formEntrega.get('direccionFacturacion.estado').updateValueAndValidity();

        this.clienteDireccion=this.formEntrega.controls.direccion.value
      }else{
       if (this.formEntrega.controls.formaDeEntrega?.value == "Envío a domicilio") {
        
        if (this.tieneDireccion) {
          if (!this.nuevaDireccion) {
            this.formEntrega.get('direccion.calle').setValue(this.direccionUsuario.calle);
            this.formEntrega.get('direccion.numeroCalle').setValue(this.direccionUsuario.numeroCalle);
            this.formEntrega.get('direccion.codigoPostal').setValue(this.direccionUsuario.codigoPostal);
            this.formEntrega.get('direccion.ciudad').setValue(this.direccionUsuario.ciudad);
            console.log(this.formEntrega.controls.direccion.value)
            this.clienteDireccion=this.formEntrega.controls.direccion.value
          }else{
            if (this.formEntrega.invalid){
              this.formValido=false;
              this.mostrarMsjeEnvio=true
              return this.formEntrega.markAllAsTouched();
            }else{

              this.formEntrega.controls.direccion.disable()
            this.clienteDireccion=this.formEntrega.controls.direccion.value
            this.entrega=this.formEntrega.controls.formaDeEntrega?.value;
            let idPago =this.formEntrega.controls.formaDePago?.value;
            setTimeout(() => {
            this.getMedioDePago(idPago);
            
            }, 150);
            }
          }
        }else{ // si no tiene direccion 
          if (this.formEntrega.invalid){
            this.mostrarMsjeEnvio=true;
            console.log("aqui")
            return this.formEntrega.markAllAsTouched();
           
          }else{
            this.mostrarMsjeEnvio=false
            document.getElementById("btn-guardar-envio").style.display="none"
            let checkRepetir= document.getElementById("repetir") as HTMLInputElement;
            //// si no tiene direccion guardo la direccion de facturacion para enviar al perfil 
            this.direccionPerfil=this.formEntrega.controls.direccionFacturacion.value;
            /// si no tiene direccion me fijo si el repetir esta checked , uso la direccion de facturacion
            if (checkRepetir.checked) {
              this.clienteDireccion=this.formEntrega.controls.direccionFacturacion.value
              this.entrega=this.formEntrega.controls.formaDeEntrega?.value;
              let idPago =this.formEntrega.controls.formaDePago?.value;
              setTimeout(() => {
              this.getMedioDePago(idPago);
              }, 150);
            }else{ //// si no esta checked es porque tengo q tomar los datos del form direccion envio
              
                if (this.formEntrega.invalid){
                  this.mostrarMsjeEnvio=true;
                  return this.formEntrega.markAllAsTouched();
                }else{
                  this.clienteDireccion=this.formEntrega.controls.direccion.value
                  this.entrega=this.formEntrega.controls.formaDeEntrega?.value;
                  let idPago =this.formEntrega.controls.formaDePago?.value;
                  setTimeout(() => {
                  this.getMedioDePago(idPago);
                  }, 150);
                  this.formEntrega.controls.direccion.disable();
                }
              }
          }
        }
      }
    }

       //this.clienteDireccion=this.formEntrega.controls.direccion.value
       this.entrega=this.formEntrega.controls.formaDeEntrega?.value;
       let idPago =this.formEntrega.controls.formaDePago?.value;
        setTimeout(() => {
        this.getMedioDePago(idPago);
        
        }, 150);
        // this.formEntrega.disable();
        console.log(this.formEntrega);
        this.mostrarConfirmacion=true;

        setTimeout(() => {
          this.enviarInfoAConfirmData() 
        }, 1100);
      /// envio la direccion de facturacion, si tiene , al perfil 
      this.enviarDireccionPerfil()

    }
  
     
  }
  
  crearForm(){
    this.formEntrega=this.fb.group({
      formaDePago:["",Validators.required],
      formaDeEntrega:["", Validators.required],
      direccion: this.fb.group({
          ciudad:[""],
          pais:[""],
          estado:[""],
          calle:[""],
          numeroCalle:[""],
          piso:[""],
          codigoPostal:[""],
          }),
      direccionFacturacion: this.fb.group({
          ciudad:["", Validators.required],
          pais:["", Validators.required],
          estado:["", Validators.required],
          calle:["", Validators.required],
          numeroCalle:["", Validators.required],
          piso:[""],
          codigoPostal:["", Validators.required],
          })
      })
  }
  //// getters direccion envio 
    get calleInvalida() {
      return this.formEntrega.get('direccion.calle').invalid && this.formEntrega.get('direccion.calle').touched;
    }
    get nroInvalido() {
      return this.formEntrega.get('direccion.numeroCalle').invalid && this.formEntrega.get('direccion.numeroCalle').touched;
    }
    get cpInvalido() {
      return this.formEntrega.get('direccion.codigoPostal').invalid && this.formEntrega.get('direccion.codigoPostal').touched;
    }
    get ciudadInvalida() {
      return this.formEntrega.get('direccion.ciudad').invalid && this.formEntrega.get('direccion.ciudad').touched;
    }
    get paisInvalido() {
      return this.formEntrega.get('direccion.pais').invalid && this.formEntrega.get('direccion.pais').touched;
    }
    get estadoInvalido() {
      return this.formEntrega.get('direccion.estado').invalid && this.formEntrega.get('direccion.estado').touched;
    }
    /// FIN direcionEnvio getters

   ////// form direccion de facturacion 
    get calleInvalidaFacturacion() {
      return this.formEntrega.get('direccionFacturacion.calle').invalid && this.formEntrega.get('direccionFacturacion.calle').touched;
    }
    get nroInvalidoFacturacion() {
      return this.formEntrega.get('direccionFacturacion.numeroCalle').invalid && this.formEntrega.get('direccionFacturacion.numeroCalle').touched;
    }
    get cpInvalidoFacturacion() {
      return this.formEntrega.get('direccionFacturacion.codigoPostal').invalid && this.formEntrega.get('direccionFacturacion.codigoPostal').touched;
    }
    get ciudadInvalidaFacturacion() {
      return this.formEntrega.get('direccionFacturacion.ciudad').invalid && this.formEntrega.get('direccionFacturacion.ciudad').touched;
    }
    get paisInvalidoFacturacion() {
      return this.formEntrega.get('direccionFacturacion.pais').invalid && this.formEntrega.get('direccionFacturacion.pais').touched;
    }
    get estadoInvalidoFacturacion() {
      return this.formEntrega.get('direccionFacturacion.estado').invalid && this.formEntrega.get('direccionFacturacion.estado').touched;
    }

    ////// FIN direccion de facturacion getters ///


      ///////// obtener paises, estado ciudad ////
  getPaises(){
    this.catalogoservice.getPaises().subscribe( response =>{
      this.paises=response;
     })
  }
  
  /// msotrar estados una vez que elegi el pais 
  showEstados(){
    if (this.tieneDireccion) {
      this.paisSeleccionado = this.formEntrega.get('direccion.pais').value;
      this.catalogoservice.getEstados(this.paisSeleccionado?.id).subscribe( response =>{
       this.estados=response;
      })
    }else{
      if (this.guardarDireccionFacturacion) {
        this.paisSeleccionado = this.formEntrega.get('direccion.pais').value;
        this.catalogoservice.getEstados(this.paisSeleccionado?.id).subscribe( response =>{
         this.estados=response;
        })
        let comboBoxEstados= document.getElementById("combobox-estados-envio");
        comboBoxEstados.style.display="block";
      }else{
        this.paisSeleccionado = this.formEntrega.get('direccionFacturacion.pais').value;
        this.catalogoservice.getEstados(this.paisSeleccionado.id).subscribe( response =>{
        this.estados=response;
        })
      }
    }
    

    let comboBoxEstados= document.getElementById("combobox-estados");
    comboBoxEstados.style.display="block";
  }
  /// mostrar ciudades una vez que elegi estado 
  showCiudades(){
    if (this.tieneDireccion) {
      let estadoSeleccionado = this.formEntrega.get('direccion.estado').value;
      this.catalogoservice.getCiudades(estadoSeleccionado?.id, this.paisSeleccionado.id).subscribe( response =>{
      this.ciudades=response;
      })
    }else{
      if (this.guardarDireccionFacturacion) {
        let estadoSeleccionado = this.formEntrega.get('direccion.estado').value;
        this.catalogoservice.getCiudades(estadoSeleccionado?.id, this.paisSeleccionado.id).subscribe( response =>{
        this.ciudades=response;
        })
        let comboBoxEstados= document.getElementById("combobox-ciudades-envio");
        comboBoxEstados.style.display="block";
      }else{
        let estadoSeleccionado = this.formEntrega.get('direccionFacturacion.estado').value;
        this.catalogoservice.getCiudades(estadoSeleccionado?.id, this.paisSeleccionado.id).subscribe( response =>{
        this.ciudades=response;
        })
      }
    
    }
    

   let comboBoxEstados= document.getElementById("combobox-ciudades");
   comboBoxEstados.style.display="block";
 }

 enviarInfoAConfirmData(){
    this.enviarInfoCompra.enviarCliente$.emit(this.clienteDireccion);
    this.enviarInfoCompra.enviarEntrega$.emit(this.entrega);
    this.enviarInfoCompra.enviarPago$.emit(this.pago);
    this.enviarInfoCompra.enviarMostrarConfirmacion$.emit(this.mostrarConfirmacion);
     
  }


/**  para ver que imagen mostrar en los metodos de pago */
 imgPayPal(i){
  if (i+1 == 2) {
    return true
  } else{
    return false
  }
 }
 imgEfvo(i){
  if (i+1 == 1) {
    return true
  }else{
    return false
  }
 }

   /// traigo la info del cliente loggeado para mostrar su direccion
getPerfilCliente():void{
  this.perfilClienteService.getInfoPerfilCliente().subscribe(response => {
  this.infoCliente=response;
  this.direccionUsuario=this.infoCliente.direccion
  if (this.direccionUsuario== null || this.direccionUsuario== undefined) {
    this.tieneDireccion=false
  }else{
    this.tieneDireccion=true
  }
  });
  
}

/// si no tiene direccion , guardo la direcciond efacturacion como direccion del perfil 
  enviarDireccionPerfil(){
    if(!this.tieneDireccion){
     this.perfilClienteService.editarInfoPerfilCliente(this.direccionPerfil).subscribe(response => {
     console.log(response)
      });
    }
  }

  ///*** EDITAR FORMULARIOS  */
  ///// mara mostar el icono y editar dformulario de direccion de envio y facturacion  DEL USUARIO QUE  NO TIENE DIRECCION DE PERFIL
  editarDirecionFacturacion(){
    console.log("editado")
    document.getElementById("edit-facturacion").style.display="none";
    this.formEntrega.controls.direccionFacturacion.enable();
    this.mostrarMsje=false;
    document.getElementById("msje-btn-form-facturacion").style.display="block";
  }
  editarDireccionEnvio(){
    document.getElementById("edit-envio-2").style.display="none";
    this.formEntrega.controls.direccion.enable();
    this.mostrarMsjeEnvio=false;
    document.getElementById("btn-guardar-envio").style.display="block";
  }

  mostrarEditarForm(){
    if (!this.formEntrega.invalid){
      document.getElementById("edit-envio-2").style.display="block";
    }
  }
///// mara mostar el icono y editar dformulario de direccion de envio DEL USUARIO QUE TIENE DIRECCION DE PERFIL
  mostarEditarFormUno(){
      document.getElementById("edit-envio-1").style.display="block";
      document.getElementById("btn-guardar-envio").style.display="none";
  }
  editarDireccionEnvioUno(){
    document.getElementById("edit-envio-1").style.display="none";
    this.formEntrega.controls.direccion.enable();
    this.mostrarMsjeEnvio=false;
    document.getElementById("btn-guardar-envio").style.display="block";
  }
  }
