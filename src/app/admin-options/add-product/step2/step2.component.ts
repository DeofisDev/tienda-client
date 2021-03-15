
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
/* import { timeStamp } from 'console'; */
import { Subscription } from 'rxjs';
import { Producto } from 'src/app/products/clases/producto';
import { UnidadMedida } from 'src/app/products/clases/unidad-medida';
import { CatalogoService } from 'src/app/products/services/catalogo.service';
import Swal from 'sweetalert2';
import { DataService } from '../../admin-promos/data.service';
import { EnviarProductoService } from '../../enviar-producto.service';
import { ProductoService } from '../../producto.service';

@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.scss']
})
export class Step2Component implements OnInit, OnDestroy {
  @Input() newProduct: Producto;
  // file
  url: string;
  selectedFile: File = null;
  cerrarModalPromo: Subscription;
  listaDePropiedades: string;
  mostrarStep3: boolean;
  formEdicionProducto: FormGroup;

  unidadSeleccionada: UnidadMedida;
  unidadesMedida: UnidadMedida[];
  unidad: string = "-Unidad de Medida-";

  numeroDeRepeticionesPlus:number; //Cantidad de repeticiones de la tarjeta (+) para nueva img secundaria.

  constructor( private productoService: ProductoService,
               private dataService: DataService,
               public modal: NgbModal,
               private router: Router,
               private catalogoservice: CatalogoService,
               private fb: FormBuilder,
               private enviarNewProduct: EnviarProductoService,
               private catalogoService: CatalogoService ) {

    /* this.newProduct = new Producto(); */

  }

  ngOnInit(): void {

    

    this.newProduct.imagenes = [];
    console.log(this.newProduct);
    
    this.numeroDeRepeticionesPlus = 5 - this.newProduct.imagenes.length //Para tarjetas de imagenes secundarias

    //// para suscribirse a cerrar el componente de promos
    this.cerrarModalPromo = this.dataService.cerrarModal$.subscribe(resp => {
      console.log(resp)
    })
    this.crearForm();
    this.getUnidades();
    setTimeout(() => {
      this.listarPropiedades();
    }, 1000);

  }

  ngOnDestroy(): void {
    this.cerrarModalPromo.unsubscribe();
  }

  crearForm() {
    this.formEdicionProducto = this.fb.group({
      disponibilidadGeneral: [0],
      destacado: [false],
    });

  }

  get disponibilidadGeneralInvalida() {
    return this.formEdicionProducto.get('disponibilidadGeneral').invalid && this.formEdicionProducto.get('disponibilidadGeneral').touched;
  }
  ///////////// inicio logica para mostrar unidades ////////////////////

  getUnidades() {
    this.catalogoservice.getUnidades().subscribe(response => {
      this.unidadesMedida = response;
    })
  }


  ///////////// fin logica para mostrar unidades ////////////////////
  listarPropiedades() {
    let propiedades = []
    for (let x = 0; x < this.newProduct.propiedades.length; x++) {
      propiedades.push(this.newProduct.propiedades[x].nombre)
    }
    this.listaDePropiedades = propiedades.toString();
    if (this.newProduct.propiedades.length === 0) {
      this.listaDePropiedades = null
    }
  }
  ///// MODAL PROMO ////
  openCentrado(promo) {
    this.modal.open(promo, { size: 'lg', centered: true })
  }
  promoProd(producto: Producto) {
    setTimeout(() => {
      this.dataService.productoSelec$.emit(producto)
    }, 100);
  }
  //// Upload imgs///////
  readUrl(event: any) {
    // console.log(event);
    this.selectedFile = event.target.files[0];
    let nombreArchivo= this.selectedFile.name;
    document.getElementById('buscador').innerText= "imagne ";
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.onload = (event: any) => {
        this.url = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
      document.getElementById("img-ppal").style.display = "block"
      document.getElementById("no-img").style.display = "none"

    }
  }

  guardarCambios() {
    //////////////si hay una foto seleccionada, se la cargo al producto
    if (this.selectedFile !== null) {
      this.productoService.uploadPhoto(this.selectedFile, this.newProduct?.id).subscribe(response =>
        console.log(response));
    }

    this.editarDestacadoDisponibilidad()

    setTimeout(() => {
      this.cerrarForm()
    }, 1500);

  }
  editarDestacadoDisponibilidad() {
    setTimeout(() => {
      if (this.newProduct.destacado !== this.formEdicionProducto.controls.destacado.value) {
        this.productoService.destacarProducto(this.newProduct).subscribe(resp => {
          console.log(resp);
          this.catalogoService.getInfoProducto(this.newProduct.id).subscribe(response => {
            this.newProduct = response
          })
        })
      }
      this.productoService.actualizarDisponibilidadProducto(this.newProduct?.id, this.formEdicionProducto.controls.disponibilidadGeneral.value).subscribe(resp => {
        console.log(resp);
        this.newProduct = resp.producto
      });
    }, 300);
  }
  cerrarForm() {
    // si usamos el default sku me fijo que cantidad cargo en disponibilidad 
    if (this.listaDePropiedades == null) {
      if (this.newProduct?.disponibilidadGeneral !== 0) {
        Swal.fire({
          icon: 'success',
          title: 'El producto ha sido creado con éxito. ',
        });
        this.modal.dismissAll();
      } else {

        Swal.fire({
          icon: 'warning',
          showCancelButton: true,
          showCloseButton: true,
          confirmButtonText: 'Continuar',
          cancelButtonText: 'Editar',
          title: 'La disponibilidad de su producto es 0 unidades. ',
        }).then((result) => {
          if (result.isConfirmed) {

            Swal.fire({
              icon: 'success',
              title: 'Cambios cargados con éxito. ',
            });
            this.modal.dismissAll();

          }
        })
      }
    }

  }

  enviarMostrarStep3() {
    this.mostrarStep3 = true;
    this.enviarNewProduct.mostrarStep3.emit(this.mostrarStep3);
  }
  getProduct() {
    this.catalogoService.getInfoProducto(this.newProduct.id).subscribe(resp =>
      this.newProduct = resp)
  };

  counter(i: number) {
    return new Array(i);
  };

  actualizarImagenesSecundariasProducto(){

    this.productoService.getProducto(this.newProduct.id).subscribe((resp:any) => {
      this.newProduct =  resp.producto;
      this.numeroDeRepeticionesPlus = 5 - this.newProduct.imagenes.length;
      
    })

  }

}
