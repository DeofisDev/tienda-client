import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MockCartService } from 'src/app/cart/services/mock-cart.service';
import { ItemCarrito } from 'src/app/cart/clases/item-carrito';
import { Producto } from 'src/app/products/clases/producto';
import { CatalogoService } from 'src/app/products/services/catalogo.service';
import { PropiedadProducto } from 'src/app/products/clases/propiedad-producto';

@Component({
  selector: 'app-card-carousel',
  templateUrl: './card-carousel.component.html',
  styleUrls: ['./card-carousel.component.scss']
})
export class CardCarouselComponent implements OnInit {
  @Input() producto:Producto;
  infoProducto:Producto;
  destacado:boolean=false;
  oferta:boolean=false;
  tieneFotoPpal:boolean;
  constructor(private catalogoservice:CatalogoService,private _cartService:MockCartService) { }

  ngOnInit(): void {
    this.infoProducto=new Producto();
    this.destacadosInsignia();
    this.tieneFoto();
    this.estaEnOferta();
    console.log(this.producto);
    
  }


  destacadosInsignia(){
    if (this.producto.destacado) {
      this.destacado=true
    }else{
      this.destacado=false
    }
  }
  tieneFoto(){
    if (this.producto.foto!==null) {
      if (this.producto.foto.imageUrl!==null) {
        this.tieneFotoPpal=true
      }else{
        this.tieneFotoPpal=false
      }
    }
  }
  mostrarPrecio(){
    if (this.oferta) {
      return false
    }else{
      return true
    }
  }
  estaEnOferta(){
    if (this.producto.promocion!== null) {
        this.oferta=true   
    }else{
      this.oferta=false
    }
  }



  saveToFav(){
  // let hearts=document.getElementsByClassName("fav") as HTMLCollectionOf<HTMLElement>;
  // for (let i = 0; i < hearts.length; i++) {
  //     hearts[i].style.color="red";
  //   hearts[i].classList.add("fas");       
  // } 
 
}



}
