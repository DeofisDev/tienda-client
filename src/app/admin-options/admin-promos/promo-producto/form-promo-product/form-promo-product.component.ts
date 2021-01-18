import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ProductoService } from 'src/app/admin-options/producto.service';
import { ValidadoresService } from 'src/app/log-in/services/validadores.service';
import { Producto } from 'src/app/products/clases/producto';
import { Sku } from 'src/app/products/clases/sku';
import { CatalogoService } from 'src/app/products/services/catalogo.service';
import Swal from 'sweetalert2';
import { Promocion } from '../../clases/promocion';
import { DataService } from '../../data.service';
import { ConvertFechaPipe } from '../../../../pipes/convert-fecha.pipe';


@Component({
  selector: 'app-form-promo-product',
  templateUrl: './form-promo-product.component.html',
  providers: [ConvertFechaPipe],
  styleUrls: ['./form-promo-product.component.scss']
})
export class FormPromoProductComponent implements OnInit, OnDestroy {

  accion: string;

  productoGeneral:any;

  promocionSegunSku: boolean;
  /* producto:Producto; */
  /* productosASeleccionar:Producto[] = [];
  productosSeleccionados:Producto[] = []; */
  infoFechaInicio = "Si no selecciona una fecha de inicio, por defecto será la actual.";
  infoPrecioOferta = "Precio final una vez aplicada la promoción."
  filterProductos = "";

  /* sku:Sku; */

  formProducto:FormGroup;

  tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
  localISOTime = (new Date(Date.now() - this.tzoffset)).toISOString().slice(0, -8);

  promocion:Promocion;

  suscripcion: Subscription;
  suscripcionSku: Subscription;

  constructor( private catalogoService: CatalogoService,
               private validadores: ValidadoresService,
               private fb:FormBuilder,
               private productoService: ProductoService,
               private dataService: DataService,
               private fecha: ConvertFechaPipe ) { }

  ngOnInit(): void {

    this.accion = "newPromoProduto";

    this.suscripcion = this.dataService.productoSelec$.subscribe(producto => {
      /* this.productosSeleccionados.push(producto) */
      this.productoGeneral = new Producto();
      /* this.producto = new Producto(); */
      this.productoGeneral = producto;
      /* this.producto = producto; */
      console.log(this.localISOTime, "Prueba")
      
      
      
      
      
    });

    this.suscripcionSku = this.dataService.productoSkuSelec.subscribe(sku => {
      /* this.sku.push(sku) */
      this.productoGeneral = new Sku();
      /* this.sku = new Sku();
      this.sku = sku; */
      this.productoGeneral = sku;
      this.accion = "newPromoSku";
    })



    /* this.obtenerProductos(); */
    this.crearFormularioPromProducto();
    this.cargarFechaDesde();
    this.promocion = new Promocion();
    this.promocionSegunSku = true;
    this.formProducto.get('porcentaje').setValidators([Validators.required, Validators.max(90), Validators.min(5)]);
    this.formProducto.get('precio').setValidators(null);

  };

  ngOnDestroy(): void {
  
    this.suscripcion.unsubscribe();
    this.suscripcionSku.unsubscribe();
    
  }

  crearFormularioPromProducto(){

    this.formProducto = this.fb.group({
      fechaDesde: [''],
      fechaHasta: ['', Validators.required],
      porcentaje: [''],
      precio: ['']
    },{
      validators: this.validadores.validarFechas('fechaDesde', 'fechaHasta')
    })

  };

  get fechaDesdeInvalida(){
    this.formProducto.setValidators([])
    return this.formProducto.get('fechaDesde');
  };

  get fechaHastaInvalida(){
    /* return this.formSubcategoria.get('fechaHasta').invalid && this.formSubcategoria.get('fechaHasta').touched; */
    const fechaDesde =  this.formProducto.get('fechaDesde').value;
    const fechaHasta =  this.formProducto.get('fechaHasta').value;

    if ( (new Date(fechaDesde).getTime() >= new Date(fechaHasta).getTime()) || this.formProducto.get('fechaHasta').invalid && this.formProducto.get('fechaHasta').touched ) {
      return true
    }else{
      return false
    }
  };

  get porcentajeInvalido(){
    return this.formProducto.get('porcentaje').invalid && this.formProducto.get('porcentaje').touched;
  };

  get precioInvalido(){
    return this.formProducto.get('precio').invalid && this.formProducto.get('precio').touched;
  };

  cargarFechaDesde(){
    this.formProducto.setValue({
      fechaDesde: this.localISOTime,
      fechaHasta: "",
      porcentaje: "",
      precio: ""
    });
  };

  crearPromocion(){

    console.log(this.formProducto);
    

    if (this.formProducto.invalid) {

      return Object.values( this.formProducto.controls ).forEach(control => {

       if (control instanceof FormGroup) {
         Object.values( control.controls ).forEach(control => control.markAsTouched());
       } else{
         control.markAsTouched();
       }
     });  
   }

    this.promocion.fechaDesde = this.formProducto.controls.fechaDesde.value + "-03:00";
    this.promocion.fechaHasta = this.formProducto.controls.fechaHasta.value + "-03:00";
    if (this.promocionSegunSku) {
      this.promocion.porcentaje = ( this.formProducto.controls.porcentaje.value / 100 );
    }else{
      this.promocion.precioOferta = this.formProducto.controls.precio.value;
    }
    
    

    /* console.log(this.promocion); */

    if (this.accion === "newPromoProduto") {

      this.productoService.createNewPromotionProducto(this.promocion, this.productoGeneral.id).subscribe(resp => {
        console.log(resp);
        
      });
      this.alertaExito("¡Promocion creada con éxito!");
      return

    };

    if ( this.accion === "newPromoSku" ) {

      this.productoService.createNewPromotionSku(this.promocion, this.productoGeneral.id).subscribe(resp => {
        console.log(resp);
        
      })
      this.alertaExito("¡Promoción creada con éxito!")
      return;
    };

    

  };

  /* eliminarProducto(j:number){
    this.productosASeleccionar.push(this.productosSeleccionados[j]);
    this.dataService.productoNo$.emit(this.productosSeleccionados[j]);
    this.productosSeleccionados.splice(j, 1);
    
  }; */

  cerrarModal(){
    this.dataService.cerrarModal$.emit();
  };


  alertaExito(msj: string){

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-primary',
      },
      buttonsStyling: true
    })
    
    swalWithBootstrapButtons.fire({
      text: msj,
      icon: 'success',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#1f4e84'
    }).then(result => {
      this.cerrarModal();
    })

  }

  precio(){

    this.promocionSegunSku = false;
    this.formProducto.get('porcentaje').setValidators(null);
    this.formProducto.get('porcentaje').setValue("");
    this.formProducto.get('precio').setValidators([Validators.required, Validators.min(0.1)]);
  };

  porcentaje(){

    this.promocionSegunSku = true;
    this.formProducto.get('precio').setValidators(null);
    this.formProducto.get('precio').setValue("");
    this.formProducto.get('porcentaje').setValidators([Validators.required, Validators.max(90), Validators.min(5)]);

  };

  tipoObjeto(objeto:any): boolean{
    /* console.log(objeto instanceof Producto); */
    console.log(this.productoGeneral)
    return objeto instanceof Producto
  }
}
