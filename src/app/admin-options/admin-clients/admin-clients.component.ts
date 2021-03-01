import { Component, OnInit, ViewChild } from '@angular/core';

import { Cliente } from 'src/app/log-in/clases/cliente/cliente'

import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import {MatSnackBar} from '@angular/material/snack-bar';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientsService } from '../clients.service';

@Component({
  selector: 'app-admin-clients',
  templateUrl: './admin-clients.component.html',
  styleUrls: ['./admin-clients.component.scss']
})
export class AdminClientsComponent implements OnInit {

  clientes: Cliente[] = [];

  page_size: number = 5;
  page_number:number = 1;
  pageSizeOptions = [5, 10, 20, 50]
  arrow:boolean;
  filterPromos = '';

  columnsToDisplay = ['id', 'dni', 'nombre', 'apellido', 'email', 'telefono', 'fechaNacimiento', 'direccion', 'tools'];
  data = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor( private clientsService: ClientsService ) { }

  ngOnInit(): void {

    this.obtenerClientes()

  };

  obtenerClientes(){

    this.clientsService.getClientes().subscribe((resp: any) => {
      this.clientes = resp;
      this.data.data = this.clientes;
      this.data.paginator = this.paginator;
      this.data.sort = this.sort;
      console.log(this.clientes);
      
    })
  };

}
