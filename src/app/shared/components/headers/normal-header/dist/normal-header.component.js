"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.NormalHeaderComponent = void 0;
var core_1 = require("@angular/core");
var NormalHeaderComponent = /** @class */ (function () {
    function NormalHeaderComponent(catalogoservice, router, _cartService, authService, carritoService) {
        this.catalogoservice = catalogoservice;
        this.router = router;
        this._cartService = _cartService;
        this.authService = authService;
        this.carritoService = carritoService;
        this.totalPrice = 0;
        this.totalQuantity = 0;
    }
    NormalHeaderComponent.prototype.ngOnInit = function () {
        //this.totalQuantity = this.carritoService.getTotalItems();
        //this.carritoService.totalItemsEmmiter.subscribe(resp => this.totalQuantity = resp)
        this.verificarSesion();
        //to keep seeing the scroll and adjust the header opacity
        // window.addEventListener("scroll",this.headerEffect)
        // get category list 
        this.getListaCategorias();
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
    };
    /***** GET CATEGORIES *****/
    NormalHeaderComponent.prototype.getListaCategorias = function () {
        var _this = this;
        this.catalogoservice.getListaCategorias().subscribe(function (response) {
            _this.categorias = response;
            console.log(response);
        });
    };
    /********DROP DOWN MENUS */
    //***categories */
    NormalHeaderComponent.prototype.showCategories = function () {
        var categoriesList = document.getElementById("categoriesList");
        categoriesList.style.display = "block";
        this.bgOpenMenu();
    };
    NormalHeaderComponent.prototype.showsubcategories = function (index) {
        var container = document.getElementById("container-sub");
        container.style.display = "initial";
        //  console.log(this.categorias[index].subcategorias);
        var categoriaActual = this.categorias[index];
        var subcatActuales = categoriaActual.subcategorias;
        console.log(subcatActuales);
        for (var x = 0; x < subcatActuales.length; x++) {
            var itemSubcategoria = document.createElement("p");
            itemSubcategoria.classList.add("borrar");
            itemSubcategoria.innerText = subcatActuales[x].nombre;
            document.getElementById("container-sub").appendChild(itemSubcategoria);
        }
        var borrar = document.querySelectorAll(".borrar");
    };
    NormalHeaderComponent.prototype.hiddeSubAndCategories = function () {
        var containerSubcategories = document.getElementById("container-sub");
        containerSubcategories.style.display = "none";
        var categoriesList = document.getElementById("categoriesList");
        categoriesList.style.display = "none";
        this.hiddeBgMenu();
    };
    ///****User options */
    NormalHeaderComponent.prototype.showUserMenu = function () {
        var userOptions = document.getElementById("userOptions");
        userOptions.style.display = "block";
        this.bgOpenMenu();
    };
    NormalHeaderComponent.prototype.hiddeUserMenu = function () {
        var userOptions = document.getElementById("userOptions");
        userOptions.style.display = "none";
        this.hiddeBgMenu();
    };
    /******* Background Menu */
    NormalHeaderComponent.prototype.bgOpenMenu = function () {
        var bgCategories = document.getElementById("bg-menu");
        bgCategories.style.display = "block";
    };
    NormalHeaderComponent.prototype.hiddeBgMenu = function () {
        var bgCategories = document.getElementById("bg-menu");
        bgCategories.style.display = "none";
    };
    /**** Search bar  ****/
    NormalHeaderComponent.prototype.buscarProducto = function (termino) {
        this.router.navigate(['/search', termino]);
    };
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
    NormalHeaderComponent.prototype.verificarSesion = function () {
        var _this = this;
        this.authService.loggedIn.subscribe(function (resp) { return _this.estaLogueado = resp; });
        this.estaLogueado = this.authService.isLoggedIn();
    };
    /**
     * Valida que el usuario posea el rol para poder visualizar el recurso solicitado.
     * @param role string rol requerido para mostrar el recurso.
     */
    NormalHeaderComponent.prototype.hasRole = function (role) {
        return this.authService.hasRole(role);
    };
    /**
     * Cerrar sesión y eliminar datos de la misma.
     */
    NormalHeaderComponent.prototype.logout = function () {
        this.authService.logout();
        this.router.navigate(['/home']);
    };
    NormalHeaderComponent = __decorate([
        core_1.Component({
            selector: 'app-normal-header',
            templateUrl: './normal-header.component.html',
            styleUrls: ['./normal-header.component.scss']
        })
    ], NormalHeaderComponent);
    return NormalHeaderComponent;
}());
exports.NormalHeaderComponent = NormalHeaderComponent;
