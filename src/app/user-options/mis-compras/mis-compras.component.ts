import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/log-in/services/auth.service';
import {animate, state, style, transition, trigger} from '@angular/animations';

import { ComprasService } from '../compras.service';
import { Operacion } from 'src/app/admin-options/admin-ventas/clases/Operacion';

import { MatSort } from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-mis-compras',
  templateUrl: './mis-compras.component.html',
  styleUrls: ['./mis-compras.component.scss'],
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
export class MisComprasComponent implements OnInit {

  misCompras: Operacion[] = [];

  estadosOperacion = ["PAYMENT_PENDING", "PAYMENT_DONE", "SENT", "RECEIVED", "CANCELLED"];
  columnsToDisplay = ['nroOperacion', 'direccion.calle', 'fechaOperacion', 'fechaEnvio', 'fechaEntrega', 'estado', 'medioPago.nombre', 'total'];
  data = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  //Formulario reactivo para filtros personalizados

  myGroup = new FormGroup({
    idFilter: new FormControl(),
    direccionFilter: new FormControl(),
    fechaFilter: new FormControl(),
    stateFilter: new FormControl()
  });

  filteredValues = {id: '', direccion: '', fecha: '', state: ''};

 constructor( private comprasServices: ComprasService ) {

   }

  ngOnInit(): void {

    this.obtenerCompras();
    this.myGroup.patchValue({
      stateFilter: ""
    })

  }



  obtenerCompras(){
    this.comprasServices.getVentasUser().subscribe((resp:any) => {
      this.misCompras = resp;

      this.data = new MatTableDataSource(this.misCompras);

      this.myGroup.controls.idFilter.valueChanges.subscribe (
        (positionFilterValue) => {
          this.filteredValues['id'] = positionFilterValue;
          this.data.filter = JSON.stringify(this.filteredValues);
        }
      );

      this.myGroup.controls.direccionFilter.valueChanges.subscribe (
        (positionFilterValue) => {
          this.filteredValues['direccion'] = positionFilterValue;
          this.data.filter = JSON.stringify(this.filteredValues);
        }
      );

      this.myGroup.controls.fechaFilter.valueChanges.subscribe (
        (positionFilterValue) => {
          this.filteredValues['fecha'] = positionFilterValue;
          this.data.filter = JSON.stringify(this.filteredValues);
        }
      );

      this.myGroup.controls.stateFilter.valueChanges.subscribe (
        (positionFilterValue) => {
          this.filteredValues['state'] = positionFilterValue;
          this.data.filter = JSON.stringify(this.filteredValues);
        }
      );

      this.data.filterPredicate = this.customPredicate()

      this.data.sort = this.sort;
      this.data.paginator = this.paginator;

      console.log(this.misCompras);
      
    })
  }

    //Funcion para modificar el FilterPredicate por defecto que viene con Angular Material, con la finalidad de hacer los filtros personalizados
    customPredicate(){

      const myFilterPredicate = function(data:Operacion, filter:any) :boolean{
  
        let searchString = JSON.parse(filter);
        console.log(searchString);
        
        let idFound = data.nroOperacion.toString().trim().toLowerCase().indexOf(searchString.id.toLowerCase()) !== -1
        let direccionFound = data.direccionEnvio.calle.toString().trim().toLowerCase().indexOf(searchString.direccion.toLowerCase()) !== -1
        let fechaFound = data.fechaOperacion.toString().trim().toLowerCase().indexOf(searchString.fecha.toLowerCase()) !== -1
        let stateFound = data.estado.toString().trim().toLowerCase().indexOf(searchString.state.toLowerCase()) !== -1
        
        if (searchString.topFilter) {
          return idFound || direccionFound || fechaFound || stateFound 
        } else {
          return idFound && direccionFound && fechaFound && stateFound 
        }
  
      }
  
      return myFilterPredicate;
  
    };

}
