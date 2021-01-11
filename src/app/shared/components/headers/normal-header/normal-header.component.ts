import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { CatalogoService } from 'src/app/products/services/catalogo.service';
import { Categoria } from 'src/app/products/clases/categoria';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ItemCarrito } from 'src/app/cart/clases/item-carrito';
import { MockCarrito } from 'src/app/cart/clases/cart';
import { MockCartService } from 'src/app/cart/services/mock-cart.service';
import { AuthService } from '../../../../log-in/services/auth.service';
import { CarritoService } from '../../../../cart/services/carrito.service';
import { Carrito } from '../../../../cart/clases/carrito';
import { Subcategoria } from 'src/app/products/clases/subcategoria';
import { Subscription } from 'rxjs';
import { EnviarInfoCompraService } from 'src/app/user-options/user-profile/services/enviar-info-compra.service';

@Component({
  selector: 'app-normal-header',
  templateUrl: './normal-header.component.html',
  styleUrls: ['./normal-header.component.scss']
})
export class NormalHeaderComponent implements OnInit {

  varietal = ["Malbec", "Ancellota", "Blend", "Cabernet Sauvignon", "Syrah"
              , "Merlot", "Chardonnay"];

  dulzor = ["Brut", "Extra Brut", "Brut Nature"]

  categorias:Categoria[];
  subcategorias: Subcategoria[];
  subscripcionInfoCompra : Subscription;
  //para el numero del carrito
  items: Array<ItemCarrito>;
  totalPrice:number = 0;
  totalQuantity:number = 0;
  carrito: Carrito;

  // Para perfil de usuario
  estaLogueado: boolean;
  totalItemsCarrito:number=null
  
  constructor (private catalogoservice:CatalogoService,
              private router:Router,
              private _cartService:MockCartService,
              private authService: AuthService,
              private enviarInfoCompra:EnviarInfoCompraService,
              private carritoService: CarritoService) { }

  ngOnInit(): void {
    //this.totalQuantity = this.carritoService.getTotalItems();
    //this.carritoService.totalItemsEmmiter.subscribe(resp => this.totalQuantity = resp)

    this.verificarSesion();
    this.getCarrito(); 
    this.subscripcionInfoCompra=this.enviarInfoCompra.enviarCantidadProductosCarrito$.subscribe(totalProductos=> {
      this.totalItemsCarrito=totalProductos;
      console.log(this.totalItemsCarrito)
    })

    //to keep seeing the scroll and adjust the header opacity
    // window.addEventListener("scroll",this.headerEffect)
 
    // get category list 
    this.getListaCategorias();
    this.getSubcategorias();
    //cart counter
    //this.carritoService.getCarrito().subscribe(response => {
    //  this.totalQuantity = response.carrito.items.length;
    //});
  //  this._cartService.currentDataCart$.subscribe(x=>{
  //   if(x) {
  //     this.items = x;
  //     this.totalQuantity = x.length;
  //      this.totalPrice = x.reduce((sum, current) => sum + (current.producto.precio * current.cantidad), 0); 
  //   }
  //     })
  }
  
  getCarrito(): void {
    if (this.authService.isLoggedIn()) {
      this.carritoService.getCarrito().subscribe((response: any) => {
        this.totalItemsCarrito = response.carrito.items.length;
        console.log(this.totalItemsCarrito)
      });
    }
    this.hayAlgoEnElCarrito()
  }
  hayAlgoEnElCarrito(){
    if (this.totalItemsCarrito!== 0) {
      return true
    }else{
      return false
    }
  }
   /***** GET CATEGORIES *****/
  getListaCategorias():void{
    this.catalogoservice.getListaCategorias().subscribe( response =>{
     this.categorias=response;
     console.log(response);
    }
     )
  }
              /********DROP DOWN MENUS */
//***categories */
  showCategories(){
    let categoriesList= document.getElementById("categoriesList");
    categoriesList.style.display="block";

    

    this.bgOpenMenu();    
  }
 
showsubcategories(index:number){
  let categories =document.getElementById("categoriesList");
  categories.style.borderRadius=" 0px 0px 0px 10px"
 let container = document.getElementById("container-sub");
 container.style.display="initial";
 let categoriaActual=this.subcategorias[index]; 
 let subcatActuales=this.varietal;

 for (let x = 0; x < subcatActuales.length ; x++) {
  let itemSubcategoria= document.createElement("p")
  itemSubcategoria.classList.add("borrar");
  itemSubcategoria.style.fontFamily="'Open Sans'";
  itemSubcategoria.style.color="rgb(87, 83, 83)";
  itemSubcategoria.style.cursor="pointer";
  if (index <=2) {
    itemSubcategoria.innerText=this.varietal[x];
  }else{
    if (x < 3) {
      itemSubcategoria.innerText=this.dulzor[x];
    }
  }
  
  document.getElementById("container-sub").appendChild(itemSubcategoria);
 }
}
hiddesubcategories(){
  let subcategorias= document.getElementsByClassName("borrar") as HTMLCollectionOf<HTMLElement>;
  for (let x = 0; x < subcategorias.length; x++) {
  subcategorias[x].style.display="none"
  }
}
hiddeSubAndCategories(){
  let containerSubcategories = document.getElementById("container-sub");
 containerSubcategories.style.display="none";
 let categoriesList= document.getElementById("categoriesList");
 categoriesList.style.display="none";
  this.hiddeBgMenu();
}
showCategoriesAndSubcategories(){
  let containerSubcategories = document.getElementById("container-sub");
  containerSubcategories.style.display="block";
  let categoriesList= document.getElementById("categoriesList");
  categoriesList.style.display="block";
}
///****User options */
showUserMenu(){
  let userOptions = document.getElementById("userOptions");
  userOptions.style.display="block";
  /* this.bgOpenMenu(); */
}
hiddeUserMenu(){
  let userOptions = document.getElementById("userOptions");
  userOptions.style.display="none";
  this.hiddeBgMenu()
}

/******* Background Menu */
bgOpenMenu(){
  let bgCategories= document.getElementById("bg-menu");
  bgCategories.style.display="block";
}
hiddeBgMenu(){
  let bgCategories= document.getElementById("bg-menu");
  bgCategories.style.display="none";
}
/******* Menu mobile */
showMenu(){
  let menu = document.getElementById("hamburgerM");
  menu.style.display="block";

   document.getElementById("openM").style.display="none";
   document.getElementById("closeM").style.display="block";
}
hiddeMenu(){
  let menu = document.getElementById("hamburgerM");
  menu.style.display="none";

   document.getElementById("openM").style.display="block";
   document.getElementById("openM").style.marginTop="5px"
   document.getElementById("closeM").style.display="none";
}

          /**** Search bar  ****/
  buscarProducto(termino:string):void {
    this.router.navigate(['/search',termino]);
   }

   irPerfil(): void {
     if (this.estaLogueado) {
       this.router.navigate(['user-profile']);
     } else {
       this.router.navigate(['login']);
     }
   }

  //   /// HEADER SCROLL EFFECT 
  // headerEffect(){
  //   let scrollTop= document.documentElement.scrollTop;
  //   let header= document.getElementById("header");
  //   let redes=document.getElementById("redes-header");
  //   let subcategories= document.getElementById("container-subcategories")
  //   let positionheader=1;
  //   if(scrollTop>positionheader){
  //     header.style.opacity="0.92";
  //     header.style.height="80px";
  //     redes.style.display="none";
  //     subcategories.style.top="80px"

  //   } else{
  //     header.style.opacity="1";
  //     header.style.height="115px"
  //     redes.style.display="flex";
  //     redes.style.justifyContent= "flex-end";
  //     subcategories.style.top="115px"
  //   }
  // }
  
  /**
   * Se encarga de recibir los cambios en la sesión. La primera vez que carga el componente
   * recibe el estado actual de la sesión, pero esta subscripto a un EventEmitter que notifica
   * a todos los subscriptores cada vez que se realiza un cambio de estado en la sesión del
   * usuario.
   */
  verificarSesion(): void {
    this.authService.loggedIn.subscribe(resp => this.estaLogueado = resp);
    this.estaLogueado = this.authService.isLoggedIn();
  }

  /**
   * Valida que el usuario posea el rol para poder visualizar el recurso solicitado.
   * @param role string rol requerido para mostrar el recurso.
   */
  hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }

  /**
   * Cerrar sesión y eliminar datos de la misma.
   */
  logout(): void {
    this.authService.logout().subscribe(response => {
      Swal.fire({
        icon: 'success',
        title: 'Sesión Cerrada',
        text: response,
        width: '350px'
      }).then(() => {
        this.router.navigate(['/home']);
        // refresh
      });
    });
  }

  getSubcategorias(){
    this.catalogoservice.getSubcategorias().subscribe(resp => {
      this.subcategorias = resp
      console.log(this.subcategorias);
      
    })
  }

}
