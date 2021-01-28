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


  }
  showDetail1(){

    ///// *** **** MOSTRAR DETALLE COMPRA *** *** /////
  let detail = document.getElementById("compra1") ;
    detail.style.display="block";
 
  ///// *** **** SUBRAYADO *** *** /////
  let border = document.getElementById("cont-compra1") ;
  border.style.borderBottom="1px solid rgb(221, 213, 213)";
 
    ///// *** **** FLECHAS *** *** /////
  let arrowDown1=document.getElementById("down1")
   arrowDown1.style.display="none"
  
  let arrowUp1=document.getElementById("up1");
   arrowUp1.style.display="block";

  };

hideDetail1() {
  ///// *** **** MOSTRAR DETALLE COMPRA *** *** /////
  let detail = document.getElementById("compra1") ;
  detail.style.display="none";
     
  ///// *** **** SUBRAYADO *** *** /////
  let border = document.getElementById("cont-compra1") ;
  border.style.borderBottom="none";
     
  ///// *** **** FLECHAS *** *** /////
  let arrowDown1=document.getElementById("down1");
  arrowDown1.style.display="block";
  let arrowUp1=document.getElementById("up1");
  arrowUp1.style.display="none";
  
  };


  open(contenido){
    
    this.modalService.open(contenido, { size: 'xl', scrollable: true});

  };

  getProductos(){
    this.productoService.getProdcutos().subscribe((resp: any) => {
      this.productos = resp;

      this.data = new MatTableDataSource(this.productos)

      this.data.filterPredicate = (data: any, filter) => {
        const dataStr = JSON.stringify(data).toLocaleLowerCase();
        return dataStr.indexOf(filter) != -1
      }
      
      this.data.paginator = this.paginator;
      
      this.data.sortingDataAccessor = (obj, property) => this.getProperty(obj, property);

      this.data.sort = this.sort;

      console.log(this.productos);
      
    })
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.data.filter = filterValue.trim().toLowerCase();
  };

  getProperty = (obj, path) => (
    path.split('.').reduce((o, p) => o && o[p], obj).toLocaleLowerCase()
  )

}
