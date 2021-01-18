import { Producto } from './../../../clases/producto';
import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MockCartService } from 'src/app/cart/services/mock-cart.service';
import { ItemCarrito } from 'src/app/cart/clases/item-carrito';
import { CatalogoService } from 'src/app/products/services/catalogo.service';
import { PropiedadProducto } from 'src/app/products/clases/propiedad-producto';
import { ValorPropiedadProducto } from 'src/app/products/clases/valor-propiedad-producto';

@Component({
  selector: 'app-card-grid',
  templateUrl: './card-grid.component.html',
  styleUrls: ['./card-grid.component.scss']
})

export class CardGridComponent implements OnInit {
  @Input() producto:Producto;
  infoProducto:Producto;
  destacado:boolean=false;
  oferta:boolean=false;
  tieneFotoPpal:boolean;
  propiedades:PropiedadProducto[]=[];
  valoresSkus:ValorPropiedadProducto[]=[];
  valoresPropiedades:string[];
  propiedadesYValoresUsadosEnSkus:PropiedadProducto;
  arrayMostrarProp:PropiedadProducto[]=[]
  constructor(private catalogoservice:CatalogoService,private _cartService:MockCartService) { }
 

  ngOnInit(): void {
    this.infoProducto=new Producto();
    this.valoresPropiedades = new Array;
    this.propiedadesYValoresUsadosEnSkus=  new PropiedadProducto();

    this.destacadosInsignia();
    this.tieneFoto();
    this.estaEnOferta();
    //obtengo los valores de mis skus
    this.obtenerValoresSkus();
    
 
    this.propiedades=this.producto.propiedades
   
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

  obtenerValoresSkus(){
    let skus = this.producto.skus;

    skus.forEach(sku => {
      let values = sku.valores;
      values.forEach((value) => {
        if (!this.valoresSkus.some(val => val.id == value.id)) {
          this.valoresSkus.push(value);
        }
      });
    });
    console.log(this.valoresSkus)
     // z abtengo las propiedades del producto , para asociar cada valor del sku a uma propiedad y mostrarla
   setTimeout(() => {
    /* this.obtenerPropiedades() */
    /* this.obtenerPro2() */

   }, 2000);

    // for (let i = 0; i <this.valoresSkus.length; i++) {
    //   this.valoresPropiedades.push(this.valoresSkus[i].valor);
    // }
  }
    obtenerPropiedades(){
      let valores =[]
      console.log(this.propiedades)
      for (let x = 0; x < 2; x++) {
        let propiedad =this.propiedades[x]?.nombre;

          // recorro los valores de cada una de mis prop
          for (let j = 0; j < this.propiedades[x]?.valores.length; j++) {
            let idValor = this.propiedades[x].valores[j].id
            ///  loc omparo con lso ids de los valores skkus
            for (let i = 0; i < this.valoresSkus.length; i++) {
              if (idValor == this.valoresSkus[i].id) {
                //si coinciden, lo agrego a mi array de valores de la propiedad q estoy recorriendo 
                valores.push(this.valoresSkus[i]?.valor)
              }
              
               
         
            }
            
          }
          /// uno el nombre de mi propiedad y sus valores en un objeto llamado propiedades y valores usados
          this.propiedadesYValoresUsadosEnSkus.nombre=propiedad;
          this.propiedadesYValoresUsadosEnSkus.valores=valores;
          console.log(this.propiedadesYValoresUsadosEnSkus)
          
          //hago un push de ese objeto al array q voy a mostrar
            this.arrayMostrarProp.push(this.propiedadesYValoresUsadosEnSkus);
             console.log(this.arrayMostrarProp);  
        
      }
      
    }

    obtenerPro2(){

      let props = this.propiedades
      console.log(props);
      

      for (let i = 0; i < this.valoresSkus.length; i++) {
        
        for (let x = 0; x < this.propiedades.length; x++) {
          
          for (let j = 0; j < this.propiedades[x].valores.length; j++) {
            
            if (this.valoresSkus[i].valor !== this.propiedades[x].valores[j].valor) {
              props.slice(j, 1)
              console.log(this.valoresSkus[i].valor, this.propiedades[x].valores[j].valor);
              
            }
            
          }
          
        }
        
      }
      console.log(props);
      

      
      

    }
  
saveToFav() {

}


}
