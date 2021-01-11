import { ProductoService } from './../../../../admin-options/producto.service';
import { ValorPropiedadProducto } from './../../../clases/valor-propiedad-producto';
import { Component, OnInit } from '@angular/core';
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


@Component({
  selector: 'app-view-more',
  templateUrl: './view-more.component.html',
  styleUrls: ['./view-more.component.scss']
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
  elegido:boolean=false;
  totalItemsCarrito:number;
  pcioNormal:boolean
  /// sku que voy a enviar al carrito
 idSkuAEnviar:number;
 skuAEnviar:Sku = null;

 /// carrito del localStorage
 skusCarritoLS;

  constructor(private catalogoservice:CatalogoService,
              private activatedroute:ActivatedRoute,
              private _cartService:MockCartService,
              private Router:Router,
              private enviarInfoCompra:EnviarInfoCompraService,
              private carritoService: CarritoService,
              private productoService:ProductoService,
              private authService: AuthService) {
    this.stock = true;
    this.infoProducto=new Producto();
    this.skusCarritoLS= new Array();
  }

  ngOnInit(): void {
    this.getProduct();
    this.getPropiedadesProducto();
 
    setTimeout(() => {
      this.getSkusDelProducto()
    }, 1000);
   
    // cambio de muestra de imagenes
    // let img2= document.getElementById("img-dos");
    // img2.addEventListener("click",this.changeImg2);
    //// boton enviar pregunta
    let btnSend = document.getElementById("enviarMsg")
    btnSend.addEventListener("click",this.deleteMessage);

    /// precio oferta
    this.estaEnOfertaElProducto();
    this.estaEnOfertaElSku();

    // destacado
    this.destacadosInsignia();
  }
  getSkusDelProducto(){
    this.productoService.getAllTheSkus(this.infoProducto?.id).subscribe(response => {
      this.skusDelProducto=response;
    });
  }
  valoresSiguienteCombobox(i){
     /// tomo el valor de la propiedad que seleccioné
      let select = document.getElementsByClassName("select") as HTMLCollectionOf<HTMLInputElement>;
      let valorCombobox= select[i].value;
      
      // me fijo si es la primer seleccion que hago desde q se iniciaron los valores
    //  if(!this.elegido){

    //  }
        for (let x = 0; x < this.skusDelProducto?.length; x++) {
          // let   valorSeleccionado= this.skusDelProducto.filter(sku=> sku.valores[x].valor ==valorCombobox);
          for (let z = 0; z < this.skusDelProducto[x]?.valores.length; z++) {
             if(this.skusDelProducto[x].valores[z].valor == valorCombobox){
           
              for (let u = 0; u < this.skusDelProducto[x].valores.length; u++) {
                if (!this.valoresSkuSleccionado.some(val => val.id == this.skusDelProducto[x].valores[u].id)) {
                  this.valoresSkuSleccionado.push(this.skusDelProducto[x].valores[u]);
                }
              }
             }
          }
         };
        
        console.log(this.valoresSkuSleccionado);
      
      ///filtro los skus del producto para qeudarme solo con los que tienen el valor elegido
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
        console.log(valoresPropiedad)
      });
       console.log(valorCombobox);
       

     
        setTimeout(() => {
          this.identificarSkuSeleccionado()
        }, 800);
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
      // console.log(this.valoresSkus)
    });
  }

  destacadosInsignia(){
    if (this.infoProducto.destacado) {
      this.destacado=false
    }else{
      this.destacado=true
    }
  }
  /// en los siguientes metodos veo que precio y precio oferta mostrar segun si estoy viendo el producto inicial o  si ya se eligio un sku usar el del sku
  estaEnOfertaElProducto(){
    if (this.skuAEnviar?.promocion!== null) {
        this.ofertaSku=false;
    }else{
      this.ofertaSku=true;
    }
  }
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
  ////// evaluo si ya se eligio un sku para habilitar los botones de agregar al carrito y comprar ahora 
  habilitarBotones(){
    let btnAgregarCarrito= document.getElementById("btn-carrito") as HTMLButtonElement;
    
    let btnComprar= document.getElementById("btn-comprar") as HTMLButtonElement;
    
     if (this.skuAEnviar!== null) {
      btnAgregarCarrito.disabled=false;
      btnComprar.disabled=false;
     }

  }


  ////////// INICIO CAMBIOS DE IMAGENES ////////////
 
  // changeImg2(){
  //   let imgPpal= document.getElementById("img-ppal");
  //   let url2="url(https://img.global.news.samsung.com/cl/wp-content/uploads/2020/01/lite.jpeg)";
  //  imgPpal.style.backgroundImage=url2;
  // }
//////// FIN CAMBIO DE IMAGENES //////////

//////////// EVENTO DE BOTON ENVIAR ///////////
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

  getProduct(){
    this.activatedroute.params.subscribe(param=> {
      let id= param.id;
      this.catalogoservice.getInfoProducto(id).subscribe(response => {
        this.infoProducto=response;
        setTimeout(() => {
          this.obtenerValoresSkus();
          this.filtrarPropiedades();
        }, 500);
      });
    });
  };

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
    });
  }

  getPropiedadesProducto(){
    this.activatedroute.params.subscribe(param => {
      let id = param.id;
      this.catalogoservice.getPropiedadesProducto(id).subscribe((resp:any) => {

        this.propiedadesProducto = resp;

      });
    });
  };


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
    console.log(this.skusDelProducto)
    
    // recommo mi array de skus del producto y si algun sku tiene los mismos valores seleccionados, obtengo su id
    for (let x = 0; x < this.skusDelProducto.length; x++) {
      let a = this.skusDelProducto[x].valores;
      let b = valoresAEnviar
        if ( JSON.stringify(a) == JSON.stringify(b)) {
            //identifico el sku
            this.idSkuAEnviar=this.skusDelProducto[x].id
            console.log(this.idSkuAEnviar);
          
              // con el id llamo a ese sku para luego enviarlo al servicio
            this.productoService.getSku(this.infoProducto.id, this.idSkuAEnviar).subscribe( response => {
            this.skuAEnviar=response;

            console.log(this.skuAEnviar);
            this.habilitarBotones();
            // this.agregarCarrito(this.skuAEnviar)
            })
            break;
         }       
       }
  
  
   }

  agregarCarrito(sku:Sku): void {
    // if localStorage.getItem("carrito")
   if (this.authService.isLoggedIn()) {
      this.carritoService.agregarSkuAlCarrito(sku?.id.toString()).subscribe(response => {
        console.log("producto agregado al carrito")
        console.log(response);
        this.totalItemsCarrito = response.carrito.items.length;
        setTimeout(() => {
          this.enviarInfoCompra.enviarCantidadProductosCarrito$.emit(this.totalItemsCarrito); 
        }, 100);
      });
    } else{
      console.log("usuario no logueado");
      // creo un arrayy vacio y le pusheo el sku q estoy agregando
      let arrayItemsCarrito = [];
      arrayItemsCarrito.push(sku);

      // verifico si existe micarrito
      var getlocal = localStorage.getItem("miCarrito");
      var parslocal;
      if(getlocal != null ){ /* osea si existe*/
        // parseo lo que trae para poder pushearlo a mi array
        parslocal = JSON.parse(getlocal); 
        for (let i = 0; i < parslocal.length; i++) {
          arrayItemsCarrito.push(parslocal[i]);
        }
        /// envio el array completo , con la info q me traje y parsié y con el nuevo item
        localStorage.setItem("miCarrito",JSON.stringify(arrayItemsCarrito) );
      }else{ /* si no existe, lo creo con el sku q estoy enviando como contenido*/
        console.log("else");
        localStorage.setItem("miCarrito",JSON.stringify(arrayItemsCarrito) );
      }

    }
  }
  /*
///// CANTIDAD////
public  removeOne(item:ItemCarrito){
  this._cartService.removeOneElementCart(item)
}
public addOne(item:ItemCarrito){
  this._cartService.addOneElementCart(item)
}
*/

///////// Agregar al carrito /////////
//   addCart(producto:Producto){
//     let item:ItemCarrito=new ItemCarrito();
//     item.cantidad=1;
//     item.producto=producto;
//     console.log(item.producto);
//     this._cartService.changeCart(item);
//  }

}
