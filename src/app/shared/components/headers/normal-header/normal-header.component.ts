import { Component, EventEmitter, Input, OnInit, Output, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CatalogoService } from 'src/app/products/services/catalogo.service';
import { Categoria } from 'src/app/products/clases/categoria';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ItemCarrito } from 'src/app/cart/clases/item-carrito';
import { AuthService } from '../../../../log-in/services/auth.service';
import { CarritoService } from '../../../../cart/services/carrito.service';
import { Carrito } from '../../../../cart/clases/carrito';
import { Subcategoria } from 'src/app/products/clases/subcategoria';
import { Subscription } from 'rxjs';
import { EnviarInfoCompraService } from 'src/app/user-options/user-profile/services/enviar-info-compra.service';

declare function inicializarNotificaciones(target: HTMLElement, email: string);

@Component({
  selector: 'app-normal-header',
  templateUrl: './normal-header.component.html',
  styleUrls: ['./normal-header.component.scss']
})
export class NormalHeaderComponent implements OnInit, AfterViewInit {

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

  // Para perfil de usuario y notificaciones
  @ViewChild('notificationsInbox') notificationsInbox: ElementRef;
  estaLogueado: boolean;
  userEmail: string;
  totalItemsCarrito:number=null;

  subcategoriasMostrar:Subcategoria[]=[];
  
  constructor (private catalogoservice:CatalogoService,
              private router:Router,
              private authService: AuthService,
              private enviarInfoCompra:EnviarInfoCompraService,
              private carritoService: CarritoService) { }

  ngOnInit(): void {
  
    this.verificarSesion();
    this.getCarrito(); 
    this.subscripcionInfoCompra=this.enviarInfoCompra.enviarCantidadProductosCarrito$.subscribe(totalProductos=> {
      this.totalItemsCarrito=totalProductos;
      console.log(this.totalItemsCarrito)
    })

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

  ngAfterViewInit(): void {
    this.initNotificaciones();
  }

  /**
   * Inicializa las notificaciones en el Header, utilizando #notificationsInbox
   * y el email del usuario logueado (en caso de estar logueado) para recibir las
   * notificaciones correspondientes.
   */
  initNotificaciones(): void {
    if (!this.estaLogueado) {
      return ;
    }
      
    let notificationsInboxHtmlElement = this.notificationsInbox?.nativeElement as HTMLElement;
    inicializarNotificaciones(notificationsInboxHtmlElement, this.userEmail);
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
 
    let categoriesList= document.getElementById("container-subcategories");
    categoriesList.style.display="flex";

    
    this.bgOpenMenu();    
  }
 
showsubcategories(index:number){
  /// me fijo que cantidad de subcategorias trae y en base a eso pongo la cantidad de columnas  a mostrar con los if 
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
  let categoriesList= document.getElementById("container-subcategories");
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
    this.hiddeSubAndCategories()
   }

   irPerfil(): void {
     if (this.estaLogueado) {
       this.router.navigate(['user-profile']);
     } else {
       this.router.navigate(['login']);
     }
   }

 
  
  /**
   * Se encarga de recibir los cambios en la sesión. La primera vez que carga el componente
   * recibe el estado actual de la sesión, pero esta subscripto a un EventEmitter que notifica
   * a todos los subscriptores cada vez que se realiza un cambio de estado en la sesión del
   * usuario.
   */
  verificarSesion(): void {
    this.authService.loggedIn.subscribe(resp => this.estaLogueado = resp);
    this.estaLogueado = this.authService.isLoggedIn();

    this.authService.useremail.subscribe(resp => this.userEmail = resp);
    this.userEmail = this.authService.getEmailUser();
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
        this.router.navigate(['/home']).then(() => window.location.reload());
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
