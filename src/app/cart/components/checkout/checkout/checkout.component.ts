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
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
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
            this.direccionTienda.ciudad={id:32653, nombre:"Barcelona"};
            this.direccionTienda.ciudad.nombre="Barcelona";
            this.direccionUsuario = new Direccion();
  }

  ngOnInit(): void {
    ///inicializar el fomulario
 
    this.getCarrito(); 
    this.getMediosDePago();
    this.getPerfilCliente();
    this.getPaises();
    this.crearForm(); 
    setTimeout(() => {
      this.formEntrega.get("formaDePago").setValue(1);
    }, 150);
  
   
    //// recibo del componente resumen  si llego el carrito para mostrar el bton
    this.subscripcionInfoCompra=this.enviarInfoCompra.llegoCarrito$.subscribe(resp=> {
       this.llegoCarrito=resp;
     })
     
 
  }

  ngOnDestroy():void{
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
     let paypal = document.getElementById("2") as HTMLInputElement;
        
        this.formEntrega.get("formaDePago").setValue(2)
        setTimeout(() => {
          paypal.checked=true;
        }, 100);
     let efvo= document.getElementById("1") as HTMLInputElement;
      this.mostrarEfvo=false;
      efvo.style.display="none"
    


    let inputEnvio=document.getElementById("deliver") as HTMLInputElement;
    if(inputEnvio.checked){
      if (!this.formEntrega.invalid){
        this.msjCamposIncompletos=true;
       }
    }
  }
  // se activa cuando toco el boton de editar la direccion de envio
  mostrarFormNewAdress(){
    this.nuevaDireccion=true;
    let dirPerfil = document.getElementById("dir-perfil");
    dirPerfil.style.display="none";

    this.formEntrega.get('direccion.calle').setValidators(Validators.required);
    this.formEntrega.get('direccion.nro').setValidators(Validators.required);
    this.formEntrega.get('direccion.cp').setValidators(Validators.required);
    this.formEntrega.get('direccion.ciudad').setValidators(Validators.required);
    this.formEntrega.get('direccion.pais').setValidators(Validators.required);
    this.formEntrega.get('direccion.estado').setValidators(Validators.required);
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
    setTimeout(() => {
      let efvo = document.getElementById("1") as HTMLInputElement;
      if (efvo !== null) {
        efvo.checked=true;
      }
    }, 600);
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
  guardarDatos(){
    /// guardo las vriables con la info que voy a enviar al siguiente paso : direccion, forma de entrega y de pago 
    /** para la forma de entrega me fijo si tengo q poner la direccion del local, la del perfil o la nueva  */
    if(this.formEntrega.controls.formaDeEntrega?.value == "Retiro personalmente" ){
        this.formEntrega.get('direccion.calle').setValue("Av Calle");
        this.formEntrega.get('direccion.nro').setValue("4678");
        this.formEntrega.get('direccion.cp').setValue("08007");
        this.formEntrega.get('direccion.ciudad').setValue(this.direccionTienda.ciudad);
        this.formEntrega.get('direccion.pais').setValue("");
        this.formEntrega.get('direccion.estado').setValue("");
    }else{
      if (this.formEntrega.controls.formaDeEntrega?.value == "Envío a domicilio") {
        if (this.nuevaDireccion== false) {
         
          this.formEntrega.get('direccion.calle').setValue(this.direccionUsuario.calle);
          this.formEntrega.get('direccion.nro').setValue(this.direccionUsuario.numeroCalle);
          this.formEntrega.get('direccion.cp').setValue(this.direccionUsuario.codigoPostal);
          this.formEntrega.get('direccion.ciudad').setValue(this.direccionUsuario.ciudad);
        }else{
          if (this.formEntrega.invalid){
            alert("Para finalizar la operación es necesario que ingrese una dirección de entrega válida")
            this.msjCamposIncompletos=true;
            return this.formEntrega.markAllAsTouched();
          
          }else{
          this.clienteDireccion=this.formEntrega.controls.direccion.value
          this.entrega=this.formEntrega.controls.formaDeEntrega?.value;
          let idPago =this.formEntrega.controls.formaDePago?.value;
          setTimeout(() => {
          this.getMedioDePago(idPago);
          
          }, 150);
        }
        }
      }
    }
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
   
  }
  
  crearForm(){
    this.formEntrega=this.fb.group({
      formaDePago:[1,Validators.required],
      formaDeEntrega:["Retiro personalmente", Validators.required],
      direccion: this.fb.group({
          ciudad:[""],
          pais:[""],
          estado:[""],
          calle:[""],
          nro:[""],
          piso:[""],
          cp:[""],
          })
      })
  }

    get calleInvalida() {
      return this.formEntrega.get('direccion.calle').invalid && this.formEntrega.get('direccion.calle').touched;
    }
    get nroInvalido() {
      return this.formEntrega.get('direccion.nro').invalid && this.formEntrega.get('direccion.nro').touched;
    }
    get cpInvalido() {
      return this.formEntrega.get('direccion.cp').invalid && this.formEntrega.get('direccion.cp').touched;
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
  
      ///////// obtener paises, estado ciudad ////
  getPaises(){
    this.catalogoservice.getPaises().subscribe( response =>{
      this.paises=response;
     })
  }
  
  /// msotrar estados una vez que elegi el pais 
  showEstados(){
     this.paisSeleccionado = this.formEntrega.get('direccion.pais').value;
     this.catalogoservice.getEstados(this.paisSeleccionado?.id).subscribe( response =>{
      this.estados=response;
     })

    let comboBoxEstados= document.getElementById("combobox-estados");
    comboBoxEstados.style.display="block";
  }
  /// mostrar ciudades una vez que elegi estado 
  showCiudades(){
    let estadoSeleccionado = this.formEntrega.get('direccion.estado').value;
    
    this.catalogoservice.getCiudades(estadoSeleccionado?.id, this.paisSeleccionado.id).subscribe( response =>{
     this.ciudades=response;
    })

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
  console.log(this.infoCliente)
  this.direccionUsuario=this.infoCliente.direccion
  });
}
  }
