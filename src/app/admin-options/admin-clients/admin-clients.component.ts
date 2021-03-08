import { Component, OnInit, ViewChild } from '@angular/core';

import { Cliente } from 'src/app/log-in/clases/cliente/cliente'

import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import {MatSnackBar} from '@angular/material/snack-bar';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientsService } from '../clients.service';
import { FormControl, FormGroup } from '@angular/forms';

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

  //Formulario reactivo para filtrado
  myGroup = new FormGroup({
    idFilter: new FormControl(),
    dniFilter: new FormControl(),
    nombreFilter: new FormControl(),
    apellidoFilter: new FormControl(),
    emailFilter: new FormControl(),
    direccionFilter: new FormControl()
  });

  filteredValues = {id: '', dni: '', nombre: '', apellido: '', email: '', direccion: ''};

  constructor( private clientsService: ClientsService ) { }

  ngOnInit(): void {

    this.obtenerClientes()

  };

  obtenerClientes(){

    this.clientsService.getClientes().subscribe((resp: any) => {
      this.clientes = resp;

      this.data = new MatTableDataSource(this.clientes);

      this.myGroup.controls.idFilter.valueChanges.subscribe (
        (positionFilterValue) => {
          this.filteredValues['id'] = positionFilterValue;
          this.data.filter = JSON.stringify(this.filteredValues);
        }
      );

      this.myGroup.controls.dniFilter.valueChanges.subscribe (
        (positionFilterValue) => {
          this.filteredValues['dni'] = positionFilterValue;
          this.data.filter = JSON.stringify(this.filteredValues);
        }
      );

      this.myGroup.controls.nombreFilter.valueChanges.subscribe (
        (positionFilterValue) => {
          this.filteredValues['nombre'] = positionFilterValue;
          this.data.filter = JSON.stringify(this.filteredValues);
        }
      );

      this.myGroup.controls.apellidoFilter.valueChanges.subscribe (
        (positionFilterValue) => {
          this.filteredValues['apellido'] = positionFilterValue;
          this.data.filter = JSON.stringify(this.filteredValues);
        }
      );

      this.myGroup.controls.emailFilter.valueChanges.subscribe (
        (positionFilterValue) => {
          this.filteredValues['email'] = positionFilterValue;
          this.data.filter = JSON.stringify(this.filteredValues);
        }
      );

      this.myGroup.controls.direccionFilter.valueChanges.subscribe (
        (positionFilterValue) => {
          this.filteredValues['direccion'] = positionFilterValue;
          this.data.filter = JSON.stringify(this.filteredValues);
        }
      );

      this.data.filterPredicate = this.customPredicate();

      this.data.paginator = this.paginator;
      this.data.sort = this.sort;
      console.log(this.clientes);
      
    })
  };


  //Filtro personalizado, modificando el FilterPredicate de Angular Material
  customPredicate(){

    const myFilterPredicate = function(data:Cliente, filter:any) :boolean{
      
      let dni;
      if (!data.dni) {
        dni = ""
      }

      let searchString = JSON.parse(filter);
      let idFound = data.id.toString().trim().toLowerCase().indexOf(searchString.id.toLowerCase()) !== -1
      
      let dniFound = data.dni ? (data.dni.toString().trim().toLowerCase().indexOf(searchString.dni.toLowerCase()) !== -1) : (dni.toString().trim().toLowerCase().indexOf(searchString.dni.toLowerCase()) !== -1)

      let nameFound = data.nombre.toString().trim().toLowerCase().indexOf(searchString.nombre.toLowerCase()) !== -1
      let apellidoFound = data.apellido.toString().trim().toLowerCase().indexOf(searchString.apellido.toLowerCase()) !== -1
      let emailFound = data.email.toString().trim().toLowerCase().indexOf(searchString.email.toLowerCase()) !== -1
      let direccionFound = data.direccion.calle.toString().trim().toLowerCase().indexOf(searchString.direccion.toLowerCase()) !== -1
      
      if (searchString.topFilter) {
        return idFound || dniFound || nameFound || apellidoFound || emailFound || direccionFound
      } else {
        return idFound && dniFound && nameFound && apellidoFound && emailFound && direccionFound
      }

    };

    return myFilterPredicate;

  };


  //Funcion para resetear los filtros de busqueda en la tabla de clientes.
  resetFilters(){
    this.myGroup.setValue({
      idFilter: "",
      dniFilter: "",
      nombreFilter: "",
      apellidoFilter: "",
      emailFilter: "",
      direccionFilter: ""
    })
  };

}
