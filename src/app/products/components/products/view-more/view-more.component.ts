import { DetalleCarrito } from './../../../../cart/clases/detalle-carrito';
import { ProductoService } from './../../../../admin-options/producto.service';
import { ValorPropiedadProducto } from './../../../clases/valor-propiedad-producto';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ItemCarrito } from 'src/app/cart/clases/item-carrito';
import { MockCartService } from 'src/app/cart/services/mock-cart.service';
import { Producto } from 'src/app/products/clases/producto';
import { CatalogoService } from 'src/app/products/services/catalogo.service';
import { CarritoService } from '../../../../cart/services/carrito.service';
import { AuthService } from '../../../../log-in/services/auth.service';
import { Carrito } from '../../../../cart/clases/carrito';
import { PropiedadProducto } from 'src/app/products/clases/propiedad-producto';
import { Sku } from 'src/app/products/clases/sku';
import { Router } from '@angular/router';
import { EnviarInfoCompraService } from 'src/app/user-options/user-profile/services/enviar-info-compra.service';
import { MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSnackBarRef,MatSnackBar, MatSnackBarContainer,} from  '@angular/material/snack-bar';



@Component({
  selector: 'app-view-more',
  templateUrl: './view-more.component.html',
  styleUrls: ['./view-more.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ViewMoreComponent implements OnInit {

  stock: boolean;
  infoProducto:Producto;
  propiedadesProducto:PropiedadProducto[];
  destacado:boolean;
  oferta:boolean=false;
  ofertaSku:boolean;
  valoresSkuSleccionado:ValorPropiedadProducto []=[];
  skusDelProducto:Sku [];
  valoresSkus:ValorPropiedadProducto[]=[];
  propiedadesFiltradas: PropiedadProducto[]=[];
  elegido:boolean=false;
  totalItemsCarrito:number;
  pcioNormal:boolean;
  skusCombobox:Sku[];
  tieneMasDeUna:boolean=true
  /// cantidad seleccionada para enviar al carrito
  cantidadSeleccionada:number

  /// sku que voy a enviar al carrito
  idSkuAEnviar:number;
  skuAEnviar:Sku = null;
  itemsCarrito:DetalleCarrito[]

 /// carrito del localStorage
 skusCarritoLS;
 tieneValores:boolean=true;

 /// posicion de la notificacion de producto agregado al carrito
 horizontalPosition : MatSnackBarHorizontalPosition = 'end' ;
 verticalPosition: MatSnackBarVerticalPosition = 'top' ;

  constructor(private catalogoservice:CatalogoService,
              private activatedroute:ActivatedRoute,
              private _cartService:MockCartService,
              private Router:Router,
              private enviarInfoCompra:EnviarInfoCompraService,
              private carritoService: CarritoService,
              private productoService:ProductoService,
              private snackBar:MatSnackBar,
              private authService: AuthService) {
    this.stock = true;
    this.infoProducto=new Producto();
    this.skusCarritoLS= new Array();
    this.cantidadSeleccionada=1
   
  }

  ngOnInit(): void {
    this.getProduct();
    // this.getPropiedadesProducto();
  
   
   
    // cambio de muestra de imagenes
    // let img2= document.getElementById("img-dos");
    // img2.addEventListener("click",this.changeImg2);
    //// boton enviar pregunta
    let btnSend = document.getElementById("enviarMsg")
    btnSend.addEventListener("click",this.deleteMessage);

 
  }
  getProduct(){
    this.activatedroute.params.subscribe(param=> {
      let id= param.id;
      this.catalogoservice.getInfoProducto(id).subscribe(response => {
        this.infoProducto=response;
        console.log(this.infoProducto)
        setTimeout(() => {
          this.obtenerValoresSkus();
          // this.filtrarPropiedades();
          
          this.getSkusDelProducto();
          
          
        }, 500);
      });
    });    
  };
  obtenerValoresSkus(){
    let skus = this.infoProducto.skus;

    skus.forEach(sku => {
      let values = sku.valores;
      values.forEach((value) => {
        if (!this.valoresSkus.some(val => val.id == value.id)) {
          this.valoresSkus.push(value);
        }
      });
      // console.log(this.valoresSkus)
    });
  }
  filtrarPropiedades() {
    this.propiedadesFiltradas = this.propiedadesProducto;
    this.propiedadesFiltradas?.forEach(propiedad => {
      let valoresPropiedad = propiedad.valores;
      propiedad.valores = [];
      for (let i = 0; i < this.valoresSkus.length; i++) {
        for (let x = 0; x < valoresPropiedad.length; x++) {
          if (valoresPropiedad[x].id == this.valoresSkus[i].id) {
            propiedad.valores.push(this.valoresSkus[i]);
          }
        }
      }
      if (propiedad.valores.length==0) {
        this.tieneValores=false
      }
    });
  
  }
  getSkusDelProducto(){
    this.productoService.getAllTheSkus(this.infoProducto?.id).subscribe(response => {
      this.skusDelProducto=response;
      setTimeout(() => {
        this.identificarSkuSeleccionado()
        
       }, 150);
    });
   
  }
  identificarSkuSeleccionado(){
    let idSku=  this.skusDelProducto[0].id;
    console.log(idSku)
     this.productoService.getSku(this.infoProducto.id, idSku).subscribe( response => {
       this.skuAEnviar=response; 
       console.log(this.skuAEnviar)
     })
     setTimeout(() => {
      /// precio oferta
      this.estaEnOfertaElProducto();
      // destacado
      this.destacadosInsignia();
 }, 1000);
    }

 
  ////mostar u ocultar insignia segun si es un producto destacado o no 
  destacadosInsignia(){
    if (this.infoProducto?.destacado) {
      this.destacado=true
    }else{
      this.destacado=false
    }
  }
  ////


  //// veo que precio y precio oferta mostrar segun si estoy viendo el producto inicial o  si ya se eligio un sku usar el del sku
  estaEnOfertaElProducto(){
    if (this.skuAEnviar?.promocion!== null) {
        this.ofertaSku=true;
    }else{
      this.ofertaSku=false;
    }
  }
 
  ////



  ////////// INICIO CAMBIOS DE IMAGENES ////////////
 
  // changeImg2(){
  //   let imgPpal= document.getElementById("img-ppal");
  //   let url2="url(https://img.global.news.samsung.com/cl/wp-content/uploads/2020/01/lite.jpeg)";
  //  imgPpal.style.backgroundImage=url2;
  // }
//////// FIN CAMBIO DE IMAGENES //////////
///// cantidad a enviar 


sumarUnidad(){
  /// evaluo si la cantidad seleccionada es menor q la cantidad disponible, le sumo 
  if (this.cantidadSeleccionada < this.skuAEnviar.disponibilidad) {
    this.cantidadSeleccionada=this.cantidadSeleccionada+1
    if (this.cantidadSeleccionada == this.skuAEnviar.disponibilidad) {
      document.getElementById("sumar").style.opacity="0.5"
    }
  }
 
  if (this.cantidadSeleccionada!==1) {
    document.getElementById("restar").style.opacity="1"
  }
 
}
restarUnidad(){
  if (this.cantidadSeleccionada !==1) {
    ///  si es distinto de uno le resto uno y evaluo nuevamente, si esunocambio el estilo del boton
    this.cantidadSeleccionada=this.cantidadSeleccionada-1;
    document.getElementById("sumar").style.opacity="1";
     if (this.cantidadSeleccionada==1) {
        document.getElementById("restar").style.opacity="0.5"
     }
  }
}


////


//////////// BOTON ENVIAR MENSAJE
  deleteMessage(){
     let mensaje = document.getElementById("pregunta");

    // if(mensaje.value!=="")
    // mensaje.nodeValue="";

    // cabio de cartel
    let cartel=document.getElementById("cartel");
    cartel.innerHTML="Gracias! Te responderemos a la brevedad.";
    cartel.style.color="#2779cd"
    let contenedor=document.getElementById("contenedorCartel");
  }

//// agregar al carrito y notificacion 
  agregarCarrito(sku:Sku): void {
    // if localStorage.getItem("carrito")
    if (this.authService.isLoggedIn()) {
      /// envio el sku al carrito
       this.carritoService.agregarSkuAlCarrito(sku?.id.toString(), this.cantidadSeleccionada.toString()).subscribe(response => {
         /// actualizo la cantidad acorde a la cantidad elegida 
         ///seteo la cantidad de items para compartirla por el event emmiter
         this.totalItemsCarrito = response.carrito.items.length;
         setTimeout(() => {
           this.enviarInfoCompra.enviarCantidadProductosCarrito$.emit(this.totalItemsCarrito); 
         }, 100);
       });
    } else{
      console.log("usuario no logueado");
      // creo un arrayy vacio y le pusheo el sku q estoy agregando
    
      // this.arrayItemsCarrito.items.push(detalle);

      // verifico si existe micarrito
      const getlocal = localStorage.getItem("miCarrito");
      let carrito:Carrito;
      if(getlocal != null ){ /* osea si existe*/
        // parseo lo que trae para poder pushearlo a mi array
        carrito = JSON.parse(getlocal); 
        console.log(carrito);
      
        this.carritoService.agregarItemLocal(sku,carrito)
          setTimeout(() => {
            this.enviarInfoCompra.enviarCantidadProductosCarrito$.emit(this.totalItemsCarrito); 
          }, 100);
        
        /// envio el array completo , con la info q me traje y parsié y con el nuevo item
        localStorage.setItem("miCarrito",JSON.stringify(carrito) );
      }else{ /* si no existe, lo creo con el sku q estoy enviando como contenido*/
        let nuevoCarrito:Carrito= new Carrito();
        let detalle: DetalleCarrito = new DetalleCarrito();
        detalle.sku=sku;
        detalle.cantidad=1;
        // if (detalle.sku.promocion!== null) {
        //   nuevoCarrito.total=detalle.sku.promocion.precioOferta*detalle.cantidad
        // }else{
        //   nuevoCarrito.total=detalle.sku.precio*detalle.cantidad
        // }
        nuevoCarrito.items.push(detalle);
        localStorage.setItem("miCarrito",JSON.stringify(nuevoCarrito) );
      }

    }

  
  }

  openSnackBar(){
    if ($(window).scrollTop() >= 30) {
      let snackBarRef= this.snackBar.open('Producto agregado al Carrito', null, {
        duration:1300 ,
        horizontalPosition : this .horizontalPosition,
        verticalPosition : this .verticalPosition,
        panelClass :['warning'],
        
     });
    }else{
      let snackBarRef= this.snackBar.open('Producto agregado al Carrito', null, {
        duration:1300 ,
        horizontalPosition : this .horizontalPosition,
        verticalPosition : this .verticalPosition,
        
     });
    }
   }

  ////
  /*
///// CANTIDAD////
public  removeOne(item:ItemCarrito){
  this._cartService.removeOneElementCart(item)
}
public addOne(item:ItemCarrito){
  this._cartService.addOneElementCart(item)
}
*/


}
