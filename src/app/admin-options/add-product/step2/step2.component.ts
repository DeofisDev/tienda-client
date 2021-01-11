import { DataPromoSubService } from './../../admin-propiedades/data-promo-sub.service';
import { Subscription } from 'rxjs';
import { ValorPropiedadProducto } from './../../../products/clases/valor-propiedad-producto';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PropiedadProducto } from 'src/app/products/clases/propiedad-producto';
import { ProductoService } from '../../producto.service';
import { ActivatedRoute } from '@angular/router';
import { Sku } from 'src/app/products/clases/sku';
import {FormControl} from '@angular/forms';
import Swal from "sweetalert2";
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { Producto } from 'src/app/products/clases/producto';
import { Input } from '@angular/core';
import { AuthService } from '../../../log-in/services/auth.service';
import { Router } from '@angular/router';
import { DataService } from '../../admin-promos/data.service';
import { Collection } from 'typescript';
@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.scss']
})
export class Step2Component implements OnInit, OnDestroy {
  @Input() newProduct:Producto;
  properties:PropiedadProducto[];

  values:ValorPropiedadProducto [];
  oferta:boolean=false;
  propertyID:number;
  formSkus:FormGroup;
  newSku:Sku;
  propiedades:string="propiedad";
  seleccionados= new Array;
  opcionSeleccionado:any;
  valoresSelect:Array<any>;
  skus:Sku[];
  idSkuSeleccionado:number;
  skuEditado:Sku;
  cerrarModalPromo:Subscription;
  cerrarModalPropiedad:Subscription;
  mostrarBoton:boolean=false;
  constructor(private productoService:ProductoService,
              private fb:FormBuilder,
              private Router:Router,
               private authService: AuthService,
              private activatedroute:ActivatedRoute,
              public modal: NgbModal,
              private dataService:DataService,
              private dataPropiedad:DataPromoSubService,
              ) {
     this.newSku=new Sku();
     this.skuEditado= new Sku()
   }

  ngOnInit(): void {
     console.log(this.newProduct)
    setTimeout(() => {
      this.getPropertiesOfNewProduct();
    }, 1500); 
    this.crearForm();
   
     //// para suscribirse a cerrar el componente de promos
    this.cerrarModalPromo=this.dataService.cerrarModal$.subscribe(resp =>{
      this.modal.dismissAll();
    })

    this.cerrarModalPropiedad=this.dataPropiedad.cerrarModal$.subscribe(resp =>{
      this.modal.dismissAll();
      this.getPropertiesOfNewProduct()

    })
  }
  ngOnDestroy():void{
    this.cerrarModalPromo.unsubscribe();
    this.cerrarModalPropiedad.unsubscribe();
  }
 
  showLateralMenu(){
    if (screen.width>650) {
    let lateralmenu=document.getElementById("lateralMenu");
    lateralmenu.style.width="200px";
    let menu = document.getElementById("lateral-container");
    menu.style.display="block";
    let arrow= document.getElementById("botonMenu");
    arrow.style.display="none"
    } else{
     let lateralmenu=document.getElementById("lateralMenu");
     lateralmenu.style.opacity="0.9"
     lateralmenu.style.width="100%"
      let menu = document.getElementById("lateral-container");
       menu.style.display="block";
      let close = document.getElementById("close-menu");
      close.style.display="block";
      close.style.marginLeft="15px";
      close.style.fontSize="0.8em";
      let arrow = document.getElementById("open-menu");
      arrow.style.display="none"
    }
  }
  hiddeLateralMenu(){
    let lateralmenu=document.getElementById("lateralMenu");
    lateralmenu.style.width="30px";
    let menu = document.getElementById("lateral-container");
    menu.style.display="none";
    let boton = document.getElementById("botonMenu");
    boton.style.display="block";
    let close = document.getElementById("close-menu");
    close.style.display="none";
    let arrow = document.getElementById("open-menu");
    arrow.style.display="block";
  }
  /**
   * Cerrar sesión y eliminar datos de la misma.
   */
  logout(): void {
    this.authService.logout();
    
    this.Router.navigate(['/home']);
  }
  generateAutomaticsSkus(){
    this.productoService.generateSkus(this.newProduct.id).subscribe( response => {
      
      this.productoService.getAllTheSkus(this.newProduct.id).subscribe( response => 
        this.skus=response)})
    setTimeout(() => {
      document.getElementById("advertencia").style.display="block";
    
    }, 1000);
    this.mostrarBoton=true
  }
  eliminarTodosLosSkus(){
    let idsSkus=[];
    //lleno mi array de ids de skus
    for (let i = 0; i < this.skus.length; i++) {
      idsSkus.push(this.skus[i].id)      
    }
    
    Swal.fire({
      icon: 'warning',
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonText: 'Eliminar y Continuar',
      cancelButtonText: 'Cancelar',
      title: 'Si decide continuar, las combinaciones de su producto serán eliminadas. ',
    }).then((result) => {
      if (result.isConfirmed) {
        /// si aprieta confirmar , elimino los skus
        for (let x = 0; x < idsSkus.length; x++) {
          this.deleteSku(idsSkus[x])
        }
        // alerto que se han eliminado
        Swal.fire({
          icon: 'info',
          title: 'Las combinaciones de su producto han sido eliminadas, si desea crearlas nuevamente dirígase al panel de Administración de Productos ',
        })
         //me envio al inicio 
        this.Router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
         this.Router.navigate(['/home']);  })
        }
        })

   


  }
  deleteSku(skuId:number){
    this.productoService.deleteSku(skuId).subscribe( response => { console.log(response);
      this.productoService.getAllTheSkus(this.newProduct.id).subscribe( response => 
        this.skus=response)})
  
  }
  skuSeleccionado(id:number){
    this.idSkuSeleccionado=id
    this.productoService.getSku(this.newProduct.id, this.idSkuSeleccionado).subscribe( response => { this.skuEditado=response})
  }
  editarSku(){
   
    let disponibilidad=document.getElementById("disponibilidad-editar") as HTMLInputElement;
    let precio= document.getElementById("precio-editar") as HTMLInputElement;
 
    let disponibilidadEditar=parseInt(disponibilidad.value);
    let precioEditar=parseInt(precio.value);
   

    console.log(precioEditar);
    console.log(disponibilidadEditar)
    this.productoService.editarPrecioSku(this.idSkuSeleccionado, precioEditar).subscribe( response => { console.log(response);
      this.productoService.editarDisponibilidadSku(this.idSkuSeleccionado, disponibilidadEditar).subscribe( response => { console.log(response);
        this.productoService.getAllTheSkus(this.newProduct.id).subscribe( response => 
          this.skus=response)
      })
    })


 
  }
  crearSku(){
    if (this.formSkus.invalid){
      return this.formSkus.markAllAsTouched();
    }
      this.newSku.precio=this.formSkus.controls.precio.value;
      //this.newSku.precioOferta=this.formSkus.controls.precioOferta.value;
       this.newSku.disponibilidad=this.formSkus.controls.disponibilidad.value;
       this.newSku.producto= this.newProduct;
        this.newSku.valores=this.seleccionados;

       // crear nuevo sku
       this.productoService.createNewSku(this.newSku,this.newProduct.id).subscribe( response => {
         console.log(response);
         this.productoService.getAllTheSkus(this.newProduct.id).subscribe( response => 
         this.skus=response);
       })
       this.seleccionados=[]
    
  
    ;}
  promoSku(sku:Sku){
    setTimeout(() => {
      this.dataService.productoSkuSelec.emit(sku)
    }, 100);
  }
    
  crearForm(){
    this.formSkus=this.fb.group({
       id:[""],
       nombre:[""],
       descripcion:[""],
       precio:[this.newProduct.precio, Validators.required],
       disponibilidad:["", Validators.required],
       valoresData:[""],
      //  valores:this.fb.array([]),
       defaultProducto:[""],
       producto:[""],  
    });
   
  }
  // get valores(): FormArray{
  //   return this.formSkus.get('valores') as FormArray
  // }
  
  get precioInvalido(){
    return this.formSkus.get('precio').invalid && this.formSkus.get('precio').touched;
  }
  get disponibilidadInvalida(){
    return this.formSkus.get('disponibilidad').invalid && this.formSkus.get('disponibilidad').touched;
  }
 
  addProperty(newProduct:Producto){
    setTimeout(() => {
      this.dataPropiedad.prodSelect$.emit(newProduct)
    }, 100);
  }
  getPropertiesOfNewProduct(){
    this.productoService.getPropertiesOfAProduct(this.newProduct?.id).subscribe((response: any) => {
      this.properties=response;
    })
  }

 

  ///// MODAL ////
  openCentrado(contenido){
    this.modal.open(contenido,{size: 'lg', centered:true})
  }

  //// BOTONES
  /** Boton guardar sku  */
  mostrarBotonGuardar(){
    this.mostrarBoton=true;
  }
  guardarValores(){   
    /// formo un array de valores 
    let valores:ValorPropiedadProducto[] = [];
      for (let i = 0; i < this.properties.length; i++) {
        let propiedad=this.properties[i]

        for (let x = 0; x < propiedad.valores.length; x++) {
          valores.push(propiedad.valores[x])
        } 
      }

      /// traigo los values de mis combobox
    let select = document.getElementsByClassName("property") as HTMLCollectionOf<HTMLInputElement>;
    for (let z = 0; z < this.properties.length; z++) {
        let valorCombobox= select[z].value;
        let   valorSeleccionado= valores.filter(valor=> valor.valor ==valorCombobox);
        let objetoValorSeleccionado = valorSeleccionado[0]
        this.seleccionados.push(objetoValorSeleccionado)  
       
      }
    }

  /**Botones finales  */
 
  VerificarCantidades(){
    console.log(this.newProduct)
    if(this.skus !== null && this.skus !== undefined){
      // recorro los skus y me fijo si la disponibilidad es 0 
      for (let i = 0; i < this.skus.length; i++) {
       
        if ( this.skus[i].disponibilidad !== 0 ) {
          Swal.fire({
            icon: 'success',
            title: 'El producto y sus combinaciones han sido creadas con éxito',
          });
           //para refrescar el form 
           this.Router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
           this.Router.navigate(['/add-product']); 
        }); 
         
        }else{
          Swal.fire({
            icon: 'warning',
            title: 'Atención',
            text:  'La disponibilidad de algunas combinaciones de su producto es 0 unidades. ¿Desea Continuar?',
            showCancelButton: true,
            cancelButtonText: `Cancelar`,
            confirmButtonText: `Continuar`,
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire({
                icon: 'success',
                title: 'El producto y sus combinaciones han sido creadas con éxito',
              });
               //para refrescar el form 
               this.Router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
               this.Router.navigate(['/add-product']); 
            }); 
            }
          });
        
        }
        
      }
    }
  }

}
