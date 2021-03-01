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
import {MatSelectModule} from  '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Categoria } from 'src/app/products/clases/categoria';
import { FavoritosService } from 'src/app/user-options/favoritos.service';
import { Favorito } from 'src/app/products/clases/favorito';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/admin-options/admin-promos/data.service';

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
  destacado:boolean=false;
  oferta:boolean=false;
  ofertaSku:boolean=false;
  valoresSkuSleccionado:ValorPropiedadProducto []=[];
  skusDelProducto:Sku [];
  valoresSkus:ValorPropiedadProducto[]=[];
  propiedadesFiltradas: PropiedadProducto[]=[];
  mostrarActualizar:boolean=false;
  totalItemsCarrito:number;
  skusCombobox:Sku[];
  categoria:Categoria;
  /// cantidad seleccionada para enviar al carrito
  cantidadSeleccionada:number

  /// sku que voy a enviar al carrito
  idSkuAEnviar:number;
  skuAEnviar:Sku = null;
  itemsCarrito:DetalleCarrito[]

 /// carrito del localStorage
 skusCarritoLS;
 tieneValores:boolean=true

 /// posicion de la notificacion de producto agregado al carrito
 horizontalPosition : MatSnackBarHorizontalPosition = 'end' ;
 verticalPosition: MatSnackBarVerticalPosition = 'top' ;


 /// rol de usuario 
 estaLogueado: boolean;
 userEmail: string;
 
///carrito
 esFavorito:boolean;
  favoritos:Favorito[]=[];

subscripcionModal : Subscription;
modalInicio:boolean;
  constructor(private catalogoservice:CatalogoService,
              private activatedroute:ActivatedRoute,
              private _cartService:MockCartService,
              private Router:Router,
              private enviarInfoCompra:EnviarInfoCompraService,
              private carritoService: CarritoService,
              public modal: NgbModal,
              private dataService:DataService,
              private productoService:ProductoService,
              private favoritosService:FavoritosService,
              private snackBar:MatSnackBar,
              private authService: AuthService) {
    this.stock = true;
    this.infoProducto=new Producto();
    this.skusCarritoLS= new Array();
    this.skusCombobox = new Array();
    this.totalItemsCarrito = 0;
  }

  ngOnInit(): void {
    this.getProduct();
    this.getPropiedadesProducto();
   
    // cambio de muestra de imagenes
    // let img2= document.getElementById("img-dos");
    // img2.addEventListener("click",this.changeImg2);
    //// boton enviar pregunta
    let btnSend = document.getElementById("enviarMsg")
    btnSend.addEventListener("click",this.deleteMessage);

    /// precio oferta
    this.estaEnOfertaElSku();

    // destacado
    this.destacadosInsignia();
   
    this.verificarSesion();

    this.getFavoritos();

    this.subscripcionModal=this.dataService.modalInicioSesion$.subscribe(resp=> {
      this.modalInicio=resp;
       
     })
    
  }

  cantidad(){
    console.log("calculado cantidas")
    console.log(this.skuAEnviar)
    if (this.skuAEnviar!== null) {
      if (this.skuAEnviar.disponibilidad==0) {
        this.cantidadSeleccionada=0;
        this.openSnackBarNoDisponible();
      }
      else{
        this.cantidadSeleccionada=1
      }
    }else{
      this.cantidadSeleccionada= 0

    }
    
  }
  /**
   * Valida que el usuario posea el rol para poder visualizar el recurso solicitado.
   * @param role string rol requerido para mostrar el recurso.
   */
  hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }
  verificarSesion(): void {
    this.authService.loggedIn.subscribe(resp => this.estaLogueado = resp);
    this.estaLogueado = this.authService.isLoggedIn();

    this.authService.useremail.subscribe(resp => this.userEmail = resp);
    this.userEmail = this.authService.getEmailUser();
  }
  ///// obtengo el producto, sus skus  y sus propiedades para mostrar los combobox
  getProduct(){
    this.activatedroute.params.subscribe(param=> {
      let id= param.id;
      this.catalogoservice.getInfoProducto(id).subscribe(response => {
        this.infoProducto=response;
        setTimeout(() => {
          this.getSkusDelProducto();
          this.obtenerValoresSkus();
          this.filtrarPropiedades();
          this.getCategoria();
        }, 300);
      });
    });
  };

  getCategoria(){
    this.catalogoservice.getCategoriaPorSubcategoria(this.infoProducto?.subcategoria.id).subscribe(resp=>{
      this.categoria=resp;
    })
  }
  getSkusDelProducto(){
    this.productoService.getAllTheSkus(this.infoProducto?.id).subscribe(response => {
      this.skusDelProducto=response;
      this.identificarSkuSeleccionado()
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

  obtenerValoresSkus(){
    let skus = this.infoProducto.skus;

    skus.forEach(sku => {
      let values = sku.valores;
      values.forEach((value) => {
        if (!this.valoresSkus.some(val => val.id == value.id)) {
          this.valoresSkus.push(value);
        }
      });
    });
    if (skus.length===0) {
     let idDefaultSku=this.infoProducto.defaultSku.id;
     this.productoService.getSku(this.infoProducto.id, idDefaultSku).subscribe( response => {
      this.skuAEnviar=response;   
      this.cantidad();
    })

    }
  }

  getPropiedadesProducto(){
    this.activatedroute.params.subscribe(param => {
      let id = param.id;
      this.catalogoservice.getPropiedadesProducto(id).subscribe((resp:any) => {

        this.propiedadesProducto = resp;
        if (this.propiedadesProducto?.length>4) {
          console.log("tiene muchas props ")
          let contenedoCombobox= document.getElementById("cont-props");
          contenedoCombobox.style.display="grid";
        }
      });
    });
    
  };
  ////

  

  //// metodo que se activa en change del combobox, para ir trayendo skus acorde al valor seleccionado
  valoresSiguienteCombobox(i){
    /// pongo el sku ocmo null para que vuelva por unos segundos a estar los botones disabled hasta q haga todo el proceso y encuentre q los valores me generan un sku a enviar 
     this.skuAEnviar=null
 /// tomo el valor de la propiedad que seleccioné
      let select = document.getElementsByClassName("select") as HTMLCollectionOf<HTMLInputElement>;
      console.log(select)
      let valorCombobox= select[i].value;
      console.log(valorCombobox)
      let valoresElejidosHastaElMomento = []
      // me fijo si es la primer seleccion que hago desde q se iniciaron los valores
      if( this.valoresSkuSleccionado.length == 0  ){
           for (let x = 0; x < this.skusDelProducto?.length; x++) {
          // let   valorSeleccionado= this.skusDelProducto.filter(sku=> sku.valores[x].valor ==valorCombobox);
          for (let z = 0; z < this.skusDelProducto[x]?.valores.length; z++) {
             if(this.skusDelProducto[x].valores[z].valor == valorCombobox){
           /// si no hay ninguno con ese id lo pusheo
              for (let u = 0; u < this.skusDelProducto[x].valores.length; u++) {
                if (!this.valoresSkuSleccionado.some(val => val.id == this.skusDelProducto[x].valores[u].id )) {
                  this.valoresSkuSleccionado.push(this.skusDelProducto[x].valores[u]);
                }
              }
             }
          }
         };
       
      ///lleno mis propiedades filtradas con los valores que coinciden ccon los valores del combobox seleccione
      this.propiedadesFiltradas = this.propiedadesProducto;
      this.propiedadesFiltradas?.forEach(propiedad => {
        let valoresPropiedad = propiedad.valores;
        propiedad.valores = [];
        for (let i = 0; i < this.valoresSkuSleccionado.length; i++) {
          for (let x = 0; x < valoresPropiedad.length; x++) {
            if (valoresPropiedad[x].id == this.valoresSkuSleccionado[i].id) {
              propiedad.valores.push(this.valoresSkuSleccionado[i])
            }
          }
        }
      });
      this.mostrarActualizar=true;
         
      } else{
      /// filtro los valores de los combobx para en esa propiedad solo dejar el valor q elegi   
      this.propiedadesFiltradas[i].valores= this.propiedadesFiltradas[i].valores.filter((k) => k.valor == valorCombobox );
      

      
      for (let j = 0; j < select.length; j++) {
       let valorElegido=select[j].value
       if(valorElegido !== undefined && valorElegido !== null && valorElegido !== ""){
        valoresElejidosHastaElMomento.push(valorElegido)
       }
      }
      this.valoresSkuSleccionado=[];
      // lo vacio y vuelvo a llenar con g
      console.log(valoresElejidosHastaElMomento)
      console.log(this.skusDelProducto)
      for (let x = 0; x < this.skusDelProducto?.length; x++) {
        // let   valorSeleccionado= this.skusDelProducto.filter(sku=> sku.valores[x].valor ==valorCombobox);
        for (let z = 0; z < this.skusDelProducto[x]?.valores.length; z++) {
          for (let p = 0; p < valoresElejidosHastaElMomento.length; p++) {
            var preseleccion = []
            if(this.skusDelProducto[x].valores[z].valor == valoresElejidosHastaElMomento[p]){
             preseleccion.push(this.skusDelProducto[x])
            }
          }         
        } 
       };
       console.log(preseleccion)
      }
      setTimeout(() => {
        this.identificarSkuSeleccionado()
      }, 700);
  }
  identificarSkuSeleccionado(){
 
    //guardo en un array vacio los objetos completos de propiedadque coincidadn con los valores elegidos en los select
    let select = document.getElementsByClassName("select") as HTMLCollectionOf<HTMLInputElement>;
    let valoresAEnviar:ValorPropiedadProducto []=[]
    for (let i = 0; i < select.length; i++) {
      let valorCombobox= select[i].value;
      for (let x = 0; x < this.valoresSkus.length; x++) {
        if (valorCombobox == this.valoresSkus[x].valor) {
          valoresAEnviar.push(this.valoresSkus[x] as ValorPropiedadProducto); 
        }
      }
    }
    // recommo mi array de skus del producto y si algun sku tiene los mismos valores seleccionados, obtengo su id
    for (let x = 0; x < this.skusDelProducto.length; x++) {
      let a = this.skusDelProducto[x].valores;
      let b = valoresAEnviar
      console.log(a);
      console.log(b)
        if ( JSON.stringify(a) == JSON.stringify(b)) {
            //identifico el sku
            this.idSkuAEnviar=this.skusDelProducto[x].id
          
              // con el id llamo a ese sku para luego enviarlo al servicio
            this.productoService.getSku(this.infoProducto.id, this.idSkuAEnviar).subscribe( response => {
            this.skuAEnviar=response;  
            console.log(this.skuAEnviar)  
            this.cantidad();                  
            })
            break;
         }      
       }
       setTimeout(() => {
        if (this.skuAEnviar=== null) {
          this.openSnackBarNoDisponible();
        }
       }, 950);
      
  
   }
  ///////

   //// recargar el componente para que se reestablezcan los valores de los combobox 
  resetSeleccion(){
    this.mostrarActualizar=false;

      //para refrescar el componente y q se actualizen los nuevos valores
      this.Router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.Router.navigate(['/viewmore' ,this.infoProducto.id]); 
        }); 
  }
  //////
 
 //// Mostrar u ocultar la insignia de Producto Destacado
  destacadosInsignia(){
    if (this.infoProducto.destacado) {
      this.destacado=false
    }else{
      this.destacado=true
    }
  }
  ////


  //// veo que precio y precio oferta mostrar segun si estoy viendo el producto inicial o  si ya se eligio un sku usar el del sku

  estaEnOfertaElSku(){
    if (this.infoProducto.promocion!== null) {
        this.oferta=true;
    }else{
      this.oferta=false;
    }
  }
  mostrarPrecio(){
    if (this.oferta) {
      return false
    }else{
      return true
    }
  }
  mostrarPrecioProducto(){
    if(this.skuAEnviar!== null){
      return false
    }else{
      return true 
      
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
  if (this.cantidadSeleccionada !==1 && this.cantidadSeleccionada !==0) {
    ///  si es distinto de uno le resto uno y evaluo nuevamente, si esunocambio el estilo del boton
    this.cantidadSeleccionada=this.cantidadSeleccionada-1;
    document.getElementById("sumar").style.opacity="1";
     if (this.cantidadSeleccionada==1) {
        document.getElementById("restar").style.opacity="0.5"
     }
  }
}


////


//// AGREGAR AL CARRITO ///// 
  agregarCarrito(sku:Sku): void {
    // if localStorage.getItem("carrito")
   if (this.authService.isLoggedIn()) {
     /// envio el sku al carrito
      this.carritoService.agregarSkuAlCarrito(sku?.id.toString(),this.cantidadSeleccionada.toString()).subscribe(response => {
        /// actualizo la cantidad acorde a la cantidad elegida 
        ///seteo la cantidad de items para compartirla por el event emmiter
        this.totalItemsCarrito = response.carrito.items.length;
        setTimeout(() => {
          this.enviarInfoCompra.enviarCantidadProductosCarrito$.emit(this.totalItemsCarrito); 
        }, 100);
      });
      
     }else{
      // verifico si existe micarrito
      const getlocal = localStorage.getItem("miCarrito");
      let carrito:Carrito;
      if(getlocal != null ){ /* osea si existe*/
        carrito = JSON.parse(getlocal); 
      
        this.carritoService.agregarItemLocal(sku,carrito)
         /// actualizo la cantidad acorde a la cantidad elegida , si ya tiene le sumo en vez de editar 
         this.carritoService.actualizarCantidadLocal( this.cantidadSeleccionada,sku?.id,carrito)

        /// envio el array completo , con la info q me traje y parsié y con el nuevo item
        localStorage.setItem("miCarrito",JSON.stringify(carrito) );
        // envio la cantidad que tengo para la notif del header
        this.totalItemsCarrito = carrito.items.length;
        setTimeout(() => {
          this.enviarInfoCompra.enviarCantidadProductosCarrito$.emit(this.totalItemsCarrito); 
        }, 100);
      }else{ /* si no existe, lo creo con el sku q estoy enviando como contenido*/
        let nuevoCarrito:Carrito= new Carrito();
        let detalle: DetalleCarrito = new DetalleCarrito();
    
        detalle.sku=sku;
        
        detalle.cantidad=1;
        /// actualizo la cantidad acorde a la cantidad elegida 
        this.carritoService.actualizarCantidadLocal( this.cantidadSeleccionada,sku?.id,carrito)
        nuevoCarrito.items.push(detalle);
        localStorage.setItem("miCarrito",JSON.stringify(nuevoCarrito) );
        this.totalItemsCarrito = nuevoCarrito.items.length;
        setTimeout(() => {
          console.log(this.totalItemsCarrito)
          this.enviarInfoCompra.enviarCantidadProductosCarrito$.emit(this.totalItemsCarrito); 
        }, 100);
      }
    
    }

  
  }
////////////////////////////

//// COMPRAR AHORA /////////
openModal(comprarAhora){
  this.modal.open(comprarAhora,{centered:true, size: 'xl', scrollable: true})
}

/////////////////////////////
  /////**** ALERTAS ***/////
  // prod agregado al carrito
  openSnackBar(){
    if ($(window).scrollTop() >= 30) {
      let snackBarRef= this.snackBar.open('Producto agregado al Carrito', null, {
        duration:1300 ,
        horizontalPosition : this .horizontalPosition,
        verticalPosition : this .verticalPosition,
        
     });
    }else{
      let snackBarRef= this.snackBar.open('Producto agregado al Carrito', null, {
        duration:1300 ,
        horizontalPosition : this .horizontalPosition,
        verticalPosition : this .verticalPosition,
        
     });
    }
   }
   /// combinacion no disponuble
   openSnackBarNoDisponible(){
    if (this.skuAEnviar=== null) {
      if ($(window).scrollTop() >= 30) {
        let snackBarRef= this.snackBar.open('Combinación no disponible', null, {
          duration:1300 ,
          horizontalPosition : this .horizontalPosition,
          verticalPosition : this .verticalPosition,
          panelClass :['warning'],
       });
      }else{
        let snackBarRef= this.snackBar.open('Combinación no disponible', null, {
          duration:1300 ,
          horizontalPosition : this .horizontalPosition,
          verticalPosition : this .verticalPosition,
          
       });
      }
    }
   
   }
   /// link copiado
   openSnackBarLink(){
    if ($(window).scrollTop() >= 30) {
      let snackBarRef= this.snackBar.open('Link copiado en el portapapeles.', null, {
        duration:1300 ,
        horizontalPosition : this .horizontalPosition,
        verticalPosition : this .verticalPosition,
        
     });
    }else{
      let snackBarRef= this.snackBar.open('Link copiado en el portapapeles.', null, {
        duration:1300 ,
        horizontalPosition : this .horizontalPosition,
        verticalPosition : this .verticalPosition,
        
     });
    }
   }

 
////////////////////////
   mostrarPrecioOferta(){
     if (this.skuAEnviar.promocion) {
        if (this.skuAEnviar.promocion.estaVigente) {
          return true
        }else{
          return false
        }
     }else{
       return false
     }
     
   }
  ////
  
  //////// BOTON ENVIAR MENSAJE
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
 /// metodo para copiar el link de la pagina en el portapapeles
 getlink(){
  let aux = document.createElement("input");
  aux.setAttribute("value",window.location.href);
  document.body.appendChild(aux);
  aux.select();
  document.execCommand("copy");
  document.body.removeChild(aux);
  this.openSnackBarLink()
 }
 ///
 //// compartir por whatsapp
 compartirWhatsapp(){
  let url = window.location.href;
	window.open("https://api.whatsapp.com/send?text=" + encodeURIComponent("¡Te invito a que veas este producto!" + "  "+ url));
 }
 ////
 ///// Agregar a Favoritos ///////

getFavoritos(){
  if (this.authService.hasRole('ROLE_USER')) {
    this.favoritosService.getFavoritos().subscribe(resp=>{
      this.favoritos=resp;
      console.log(this.favoritos);
      this.marcarFavoritos(this.infoProducto?.id);
  
    })
  }
 
}

marcarFavoritos(id:number){
  console.log('ejecutando')
  for (let i = 0; i < this.favoritos.length; i++) {
    if (this.favoritos[i].producto.id == id) {
      this.esFavorito=true
      console.log(this.esFavorito);
    }
  }
}
administrarFavoritos(id:number){
  //si estoy logueado
  if (this.authService.isLoggedIn()) {

    // me fijo si tengo favoritos, los recorro
    if(this.favoritos.length!==0){
      //filtro los favoritos, si coincide con el id lo guardo en valor
      let valor= this.favoritos.filter(favorito=> favorito.producto.id == id)
      //si valor no tiene nada es porque no hubo coincidencia, entonces lo agrego
      if(valor.length==0){
        this.agregarFavorito(id);
      }else{
        this.eliminarFavorito(id);
      }
     
    }else{ /// si no tengo favoritos, lo agrego
      this.agregarFavorito(id);
      console.log("primer favorito")
    }
    
    
    
  }
}
 

eliminarFavorito(id:number){
  this.favoritosService.eliminarProductoFavorito(id).subscribe(resp =>{
   this.getFavoritos()
    console.log("producto quitado de favorito");
    this.esFavorito=false
  })
}

agregarFavorito(id:number){
  this.favoritosService.agregarProductoFavorito(id).subscribe(resp=>{
    console.log(resp);
    this.getFavoritos();
    this.esFavorito=true;
    console.log("producto agregado")
  })
}

abrirInicioDeSesion(){
  if (!this.authService.isLoggedIn()) {
    this.modalInicio=true
  }
}
///////////////////////////////////////////



}
