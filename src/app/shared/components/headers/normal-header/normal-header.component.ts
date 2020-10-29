import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { CatalogoService } from 'src/app/products/services/catalogo.service';
import { Categoria } from 'src/app/products/clases/categoria';
import { Router } from '@angular/router';
import { ItemCarrito } from 'src/app/cart/clases/item-carrito';
import { MockCarrito } from 'src/app/cart/clases/cart';
import { MockCartService } from 'src/app/cart/services/mock-cart.service';
import { AuthService } from '../../../../log-in/services/auth.service';
import { CarritoService } from '../../../../cart/services/carrito.service';
import { Carrito } from '../../../../cart/clases/carrito';

@Component({
  selector: 'app-normal-header',
  templateUrl: './normal-header.component.html',
  styleUrls: ['./normal-header.component.scss']
})
export class NormalHeaderComponent implements OnInit {

  categorias:Categoria[];

  //para el numero del carrito
  items: Array<ItemCarrito>;
  totalPrice:number = 0;
  totalQuantity:number = 0;
  carrito: Carrito;

  // Para perfil de usuario
  estaLogueado: boolean;
  
  constructor (private catalogoservice:CatalogoService,
              private router:Router,
              private _cartService:MockCartService,
              private authService: AuthService,
              private carritoService: CarritoService) { }

  ngOnInit(): void {
    this.totalQuantity = this.carritoService.getTotalItems();
    this.carritoService.totalItemsEmmiter.subscribe(resp => this.totalQuantity = resp)

    this.verificarSesion();

    //to keep seeing the scroll and adjust the header opacity
    // window.addEventListener("scroll",this.headerEffect)
 
    // get category list 
    this.getListaCategorias();

    //cart counter
    this.carritoService.getCarrito().subscribe(response => {
      this.totalQuantity = response.carrito.items.length;
    });
  //  this._cartService.currentDataCart$.subscribe(x=>{
  //   if(x) {
  //     this.items = x;
  //     this.totalQuantity = x.length;
  //      this.totalPrice = x.reduce((sum, current) => sum + (current.producto.precio * current.cantidad), 0); 
  //   }
  //     })
  }

   /***** GET CATEGORIES *****/
  getListaCategorias():void{
    this.catalogoservice.getListaCategorias().subscribe( response =>{
     this.categorias=response;
     console.log(response) }
     )
  }
    /////end get categories///

 
              /********DROP DOWN MENUS */
//***categories */
  showCategories(){
    let categoriesList= document.getElementById("categoriesList");
    categoriesList.style.display="block";

    this.bgOpenMenu();    
  }
 
// showSubcategories(){
//  let containerSubcategories = document.getElementById("container-subcategories");
//  containerSubcategories.style.display="initial";
//  let categoriesList= document.getElementById("categoriesList");
//  categoriesList.style.borderBottomRightRadius="0px";
// }
hiddeSubAndCategories(){
//   let containerSubcategories = document.getElementById("container-subcategories");
//  containerSubcategories.style.display="none";
 let categoriesList= document.getElementById("categoriesList");
 categoriesList.style.display="none";
  this.hiddeBgMenu();
}
///****User options */
showUserMenu(){
  let userOptions = document.getElementById("userOptions");
  userOptions.style.display="block";
  this.bgOpenMenu();
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


          /**** Search bar  ****/
  buscarProducto(termino:string):void {
    this.router.navigate(['/search',termino]);
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
    this.authService.logout();
    
    this.router.navigate(['/home']);
  }
}
