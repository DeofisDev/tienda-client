import { Component, OnInit, ViewChild } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { AuthService } from '../../log-in/services/auth.service';
import { Producto } from 'src/app/products/clases/producto';
import { CatalogoService } from '../../products/services/catalogo.service';
import { DataService } from './data.service';

/**
 * @title Data table with sorting, pagination, and filtering.
 */


@Component({
  selector: 'app-admin-promos',
  templateUrl: './admin-promos.component.html',
  styleUrls: ['./admin-promos.component.scss'],
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
export class AdminPromosComponent implements OnInit {

  productos:Producto[] = [];
  
  page_size: number = 5;
  page_number:number = 1;
  pageSizeOptions = [5, 10, 20, 50]
  value = 'Ejemplo: Galaxy';
  arrow:boolean;
  filterPromos ='';


  columnsToDisplay = ['id', 'nombre', 'subcategoria', 'precio', 'precioOf',
                       'porcentaje', 'desde', 'hasta', 'estado', 'tools'];
  data = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;



  constructor( private catalogoService: CatalogoService,
               private modalService: NgbModal,
               private router: Router,
               private dataService: DataService) { }

  ngOnInit(): void {

    this.arrow = true;
    this.obtenerProductos();

    this.dataService.cerrarModal$.subscribe(resp => {
      this.modalService.dismissAll();
    })

  }


  obtenerProductos(){
    this.catalogoService.getProductos().subscribe((resp:any) => {
      let promos = []
      for (let i = 0; i < resp.length; i++) {
        if (resp[i].promocion ) {
          promos.push(resp[i])
        }
        
      }

      this.productos = promos;
      this.data.data = this.productos;
      this.data.paginator = this.paginator;
      this.data.sort = this.sort
      
      
      
    });
  };

  

  handlePage(e: PageEvent){
    this.page_size = e.pageSize;
    this.page_number = e.pageIndex + 1 ;
  }

  //Modal nueva promoción

  open(contenido){

    this.modalService.open(contenido, { size: 'xl', scrollable: true});

  };

  arrowIcono(i:string){
    let icono = document.getElementById(i);
    if (this.arrow) {
      icono.className = "fas fa-angle-up fa-lg mr-2";
      this.arrow = false;
    }else{
      icono.className = "fas fa-angle-down fa-lg mr-2";
      this.arrow = true;
    }
    
  };

}

