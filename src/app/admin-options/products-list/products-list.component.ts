import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {animate, state, style, transition, trigger} from '@angular/animations';

import { MatSort } from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/log-in/services/auth.service';
import { Producto } from 'src/app/products/clases/producto';
import { EnviarProductoService } from '../enviar-producto.service';
import { ProductoService } from '../producto.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
  animations: [
    trigger('detailExpand',
    [
        state('collapsed, void', style({ height: '0px'})),
        state('expanded', style({ height: '*' })),
        transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        transition('expanded <=> void', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ProductsListComponent implements OnInit {

  state = "";
  key = "";
  destacado = "";

  step2: boolean = false;
  subscripcionProducto: Subscription;
  newProduct: Producto;
  flag = false;

  //Productos - Tabla
  productos:Producto[] = [];
  columnsToDisplay = ['id', 'nombre', 'precio', 'subcategoria.nombre',
                       'marca.nombre', 'disponibilidadGeneral', 'activo',
                       'destacado', 'tools'];

  data = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  productoAEditar: Producto;

  myGroup = new FormGroup({
    nameFilter: new FormControl(),
    stateFilter: new FormControl(),
    destacadoFilter: new FormControl(),
    marcaFilter: new FormControl(),
    idFilter: new FormControl(),
    subcatFilter: new FormControl()
  })

  

  filteredValues = { nombre: '', activo: '', destacado: '', marca: "", id: "", subcategoria: "" };


  constructor( private router:Router,
               private authService: AuthService,
               private modalService: NgbModal, 
               private enviarProducto: EnviarProductoService,
               private productoService: ProductoService ) {  }

  ngOnInit(): void {

    this.subscripcionProducto = this.enviarProducto.enviarProducto$.subscribe(producto => {
      this.newProduct = new Producto();
      this.newProduct = producto;
      this.step2 = true;
    });

    this.getProductos();
    this.myGroup.patchValue({
      stateFilter: "",
      destacadoFilter: ""
    })


  }


  open(contenido){
    
    this.modalService.open(contenido, { size: 'xl', scrollable: true});

  };

  getProductos(){
    this.productoService.getProdcutos().subscribe((resp: any) => {
      this.productos = resp;

      this.data = new MatTableDataSource(this.productos)

      /* this.data.filterPredicate = (data: any, filter) => {
        const dataStr = JSON.stringify(data).toLocaleLowerCase();
        return dataStr.indexOf(filter) != -1
      } */

      this.myGroup.controls.nameFilter.valueChanges.subscribe (
        (positionFilterValue) => {
          this.filteredValues['nombre'] = positionFilterValue;
          this.data.filter = JSON.stringify(this.filteredValues);
        }
      );



      this.myGroup.controls.stateFilter.valueChanges.subscribe (
        (positionFilterValue) => {
          this.filteredValues['activo'] = positionFilterValue;
          this.data.filter = JSON.stringify(this.filteredValues);
        }
      );

      this.myGroup.controls.destacadoFilter.valueChanges.subscribe (
        (positionFilterValue) => {
          this.filteredValues['destacado'] = positionFilterValue;
          this.data.filter = JSON.stringify(this.filteredValues)
        }
      );

      this.myGroup.controls.marcaFilter.valueChanges.subscribe (
        (positionFilterValue) => {
          this.filteredValues['marca'] = positionFilterValue;
          this.data.filter = JSON.stringify(this.filteredValues)
        }
      );

      this.myGroup.controls.idFilter.valueChanges.subscribe (
        (positionFilterValue) => {
          this.filteredValues['id'] = positionFilterValue;
          this.data.filter = JSON.stringify(this.filteredValues)
        }
      );

      this.myGroup.controls.subcatFilter.valueChanges.subscribe (
        (positionFilterValue) => {
          this.filteredValues['subcategoria'] = positionFilterValue;
          this.data.filter = JSON.stringify(this.filteredValues)
        }
      );

      this.data.filterPredicate = this.customPredicate();
      
      this.data.paginator = this.paginator;
      
      

      this.data.sort = this.sort;

      console.log(this.productos);
      
    })
  };

  customPredicate(){

    const myFilterPredicate = function(data:Producto, filter:any) :boolean{

      let searchString = JSON.parse(filter);
      let nameFound = data.nombre.toString().trim().toLowerCase().indexOf(searchString.nombre.toLowerCase()) !== -1
      let stateFound = data.activo.toString().trim().toLowerCase().indexOf(searchString.activo.toLowerCase()) !== -1
      let destacadoFound = data.destacado.toString().trim().toLowerCase().indexOf(searchString.destacado.toLowerCase()) !== -1
      let marcaFound = data.marca.nombre.toString().trim().toLowerCase().indexOf(searchString.marca.toLowerCase()) !== -1
      let idFound = data.id.toString().trim().toLowerCase().indexOf(searchString.id.toLowerCase()) !== -1
      let subcatFound = data.subcategoria.nombre.toString().trim().toLowerCase().indexOf(searchString.subcategoria.toLowerCase()) !== -1
      
      if (searchString.topFilter) {
        return nameFound || stateFound || destacadoFound || marcaFound || idFound || subcatFound
      } else {
        return nameFound && stateFound && destacadoFound && marcaFound && idFound && subcatFound
      }

    }

    return myFilterPredicate;

  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.data.filter = filterValue.trim().toLowerCase();
  };

  getProperty = (obj, path) => (
    path.split('.').reduce((o, p) => o && o[p], obj).toLocaleLowerCase()
  );


  resetFilters(){

    this.myGroup.setValue({
      nameFilter: "",
      stateFilter: "",
      destacadoFilter: ""
    })

  }

  

}
