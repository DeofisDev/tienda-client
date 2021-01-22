import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../log-in/services/auth.service';
import { Router } from '@angular/router';
import {animate, state, style, transition, trigger} from '@angular/animations';

import { VentasService } from '../ventas.service';

import { Operacion } from './clases/Operacion';

import { MatSort } from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import Swal from "sweetalert2";

import { ConvertFechaPipe } from '../../pipes/convert-fecha.pipe';


@Component({
  selector: 'app-admin-ventas',
  templateUrl: './admin-ventas.component.html',
  styleUrls: ['./admin-ventas.component.scss'],
  providers: [ConvertFechaPipe],
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
export class AdminVentasComponent implements OnInit, AfterViewInit {

  key = "";
  state = "";
  botonActuAcep: string;


  ventas:Operacion[] = [];
  filter = "";
  estadosOperacion = ["PAYMENT_PENDING", "PAYMENT_DONE", "SENT", "RECEIVED", "CANCELLED"];

  updateStateVenta: Operacion;

  columnsToDisplay = ['nroOperacion', 'cliente.nombre', 'direccionEnvio.calle', 'fechaOperacion', 'fechaEnviada', 'fechaRecibida', 'estado', 'total', 'tools'];
  data = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  constructor( private router:Router,
               private authService: AuthService,
               private ventasServices:  VentasService,
               private modalService: NgbModal,
               private convertFecha: ConvertFechaPipe ) { }

  ngOnInit(): void {
    
    
    this.obtenerVentas();
    this.updateStateVenta = new Operacion();
    
    
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.paginator._intl.itemsPerPageLabel = "Ventas por página";
    this.paginator._intl.nextPageLabel = "Siguiente página";
    this.paginator._intl.previousPageLabel = "Página anterior";
  }


  obtenerVentas(){
    this.ventasServices.getVentas().subscribe((resp:any) => {
      this.ventas = resp;
      /* this.data.data = this.ventas */
      this.data = new MatTableDataSource(this.ventas)
      this.data.filterPredicate = (data: any, filter) => {
        const dataStr = JSON.stringify(data).toLocaleLowerCase();
        return dataStr.indexOf(filter) != -1
      }
      this.data.paginator = this.paginator;

      this.data.sortingDataAccessor = (obj, property) => this.getProperty(obj, property);

      this.data.sort = this.sort;

      console.log(this.ventas);
    })
  };

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.data.filter = filterValue.trim().toLowerCase();
  };

  /* applyFilter(event) {
    const filterValue = event.target.value.trim().toLowerCase();
    this.data.filter = filterValue;
  }; */

  reset(){
    this.key = "";
    this.state = "";
    this.filter = "";
    this.data.filter = "";
  };

  prueba(){
    
    if (this.updateStateVenta.estado === "PAYMENT_DONE") {
      return "Enviado"
    }else if(this.updateStateVenta.estado === "SENT") {
       return "Recibido"
    }
    
  };

  esEstadoFinal(): boolean{
    if (this.updateStateVenta.estado === "RECEIVED" || this.updateStateVenta.estado === "CANCELLED") {
      this.botonActuAcep = "Aceptar"
      return true;
    }else{
      this.botonActuAcep = "Actualizar"
      return false;
    }
    
  }

  openLg(content, venta: Operacion) {
    this.updateStateVenta = venta;
    console.log(this.updateStateVenta);
    
    this.modalService.open(content, { centered: true });
  }

  updateVentaSent(){

    if (this.updateStateVenta.estado === "RECEIVED" || this.updateStateVenta.estado === "CANCELLED") {
      this.modalService.dismissAll();
      return;
      
    }

    let siguienteEstado: string;

    if (this.updateStateVenta.estado === "PAYMENT_DONE") {
      siguienteEstado = "Enviado";
    }else if(this.updateStateVenta.estado === "SENT"){
      siguienteEstado = "Recibido";
    }
    console.log(siguienteEstado);
    

    Swal.fire({
      title: `Está por actualizar el estado de la venta a ${siguienteEstado}`,
      text: "¿Está seguro que desea hacerlo?",
      icon: 'warning',
      reverseButtons: true,
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#1f4e84',
      cancelButtonColor: '#6c757d'
    }).then((result) => {
      if (result.isConfirmed) {

        this.ventasServices.updateVentaSent(this.updateStateVenta.nroOperacion).subscribe((resp:any) => {
          console.log(resp);
          this.obtenerVentas();
        })

        Swal.fire(
          '¡Listo!',
          'El estado ha sido actualizado exitosamente.',
          'success'
        )
        this.modalService.dismissAll();
        
      }
    })

  };

  cancelarOperacion(){

    Swal.fire({
      title: `Está por cancelar la venta.`,
      text: "¿Está seguro que desea hacerlo?",
      icon: 'warning',
      reverseButtons: true,
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#1f4e84',
      cancelButtonColor: '#6c757d'
    }).then((result => {
      if (result.isConfirmed) {

        this.ventasServices.cancelVenta(this.updateStateVenta.nroOperacion).subscribe((resp:any) => {
          console.log(resp);
          this.obtenerVentas();
        })

        Swal.fire(
          '¡Listo!',
          'La venta ha sido cancelada exitosamente.',
          'success'
        )
        this.modalService.dismissAll();
        
      }
    }))

  }

  tieneFechaEnvio(fecha: any){
    if (fecha) {
      return this.convertFecha.transform(fecha).substring(0, 8);
    }else{
      return "Sin enviar"
    }
  }

  tieneFechaEntrega(fecha:any){
    if (fecha) {
      return this.convertFecha.transform(fecha).substring(0, 8);
    }else{
      return "Sin entregar"
    }
  }

  getProperty = (obj, path) => (
    path.split('.').reduce((o, p) => o && o[p], obj)
  )

  

}
