import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidadoresService } from 'src/app/log-in/services/validadores.service';
import { Subcategoria } from 'src/app/products/clases/subcategoria';
import { CatalogoService } from 'src/app/products/services/catalogo.service';
import { ProductoService } from '../../producto.service';
import { Promocion } from '../clases/promocion';

@Component({
  selector: 'app-promo-subcategoria',
  templateUrl: './promo-subcategoria.component.html',
  styleUrls: ['./promo-subcategoria.component.scss']
})
export class PromoSubcategoriaComponent implements OnInit {

  filterSubcategorias = "";
  subcategorias:Subcategoria[] = [];
  subASeleccionar:Subcategoria[] = [];
  subSeleccionadas:Subcategoria[] = [];
  infoFechaInicio = "Si no selecciona una fecha de inicio, por defecto será la actual."

  promocion:Promocion;

  formSubcategoria: FormGroup;

  date = new Date().toISOString().substring(0, 16)/* split(':')[0]; */

  constructor( private fb:FormBuilder,
               private catalogoService: CatalogoService,
               private productoService: ProductoService,
               private validadores: ValidadoresService ) { }

  ngOnInit(): void {

    this.obetenerSubcategorias();
    this.crearFormularioPromSubcategoria();
    this.cargarFechaDesde();
    this.promocion = new Promocion();

  }


  crearFormularioPromSubcategoria(){

    this.formSubcategoria = this.fb.group({
      fechaDesde: [''],
      fechaHasta: ['', [Validators.required] ],
      porcentaje: ['', [Validators.required, Validators.max(90), Validators.min(5) ] ]
    },{
      validators: this.validadores.validarFechas('fechaDesde', 'fechaHasta')
    })
  };

  get fechaDesdeInvalida(){
    return this.formSubcategoria.get('fechaDesde');
  }

  get fechaHastaInvalida(){
    /* return this.formSubcategoria.get('fechaHasta').invalid && this.formSubcategoria.get('fechaHasta').touched; */
    const fechaDesde =  this.formSubcategoria.get('fechaDesde').value;
    const fechaHasta =  this.formSubcategoria.get('fechaHasta').value;

    if ( (new Date(fechaDesde).getTime() >= new Date(fechaHasta).getTime()) || this.formSubcategoria.get('fechaHasta').invalid && this.formSubcategoria.get('fechaHasta').touched ) {
      return true
    }else{
      return false
    }
  }
  get porcentajeInvalido(){
    
    return this.formSubcategoria.get('porcentaje').invalid && this.formSubcategoria.get('porcentaje').touched;
    

  }

  cargarFechaDesde(){
    this.formSubcategoria.setValue({
      fechaDesde: this.date + "-03:00",
      fechaHasta: "",
      porcentaje: ""
    })
  };

  crearPromocion(){

    console.log(this.formSubcategoria.controls.fechaDesde.value);
    

    if (this.formSubcategoria.invalid) {

      return Object.values( this.formSubcategoria.controls ).forEach(control => {

       if (control instanceof FormGroup) {
         Object.values( control.controls ).forEach(control => control.markAsTouched());
       }else{
         control.markAsTouched();
       }
     });  
   }
    
    
    /* this.promocion.fechaDesde = this.formSubcategoria.controls.fechaDesde.value + "-03:00";
    this.promocion.fechaHasta = this.formSubcategoria.controls.fechaHasta.value + "-03:00";
    this.promocion.porcentaje = ( this.formSubcategoria.controls.porcentaje.value / 100 );

    console.log(this.formSubcategoria);

    if (this.subSeleccionadas.length > 1) {

      for (let index = 0; index < this.subSeleccionadas.length; index++) {
        
        this.productoService.crearNewPromotionSub(this.promocion, this.subSeleccionadas[index].id).subscribe(resp => {
          console.log(resp);
          
        })  
      }
      
    }else{
      this.productoService.crearNewPromotionSub(this.promocion, this.subSeleccionadas[0].id).subscribe(resp => {
        console.log(resp);
        
      })
    }

    
    this.catalogoService.getSubcategorias().subscribe((resp:any) =>{
      this.subcategorias = resp;
      this.subASeleccionar = resp;    
      
    })
    this.subSeleccionadas = [];

    this.formSubcategoria.reset(); */       
    
  }


  ////////////////////////////////////////////////////////////////////////

  obetenerSubcategorias(){
    this.catalogoService.getSubcategorias().subscribe((resp:any) =>{
      this.subcategorias = resp;
      this.subASeleccionar = resp;    
      
    })
  };

  anadirSub(i:number){

    this.subSeleccionadas.push(this.subASeleccionar[i]);
    this.subASeleccionar.splice(i, 1); 
    
  }

  eliminarSub(j:number){
    this.subASeleccionar.push(this.subSeleccionadas[j]);
    this.subSeleccionadas.splice(j, 1);
  }

}
