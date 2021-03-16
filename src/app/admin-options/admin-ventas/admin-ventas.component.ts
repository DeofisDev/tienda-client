import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../log-in/services/auth.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {animate, state, style, transition, trigger} from '@angular/animations';

import { VentasService } from '../ventas.service';

import { Operacion } from './clases/Operacion';

import { MatSort } from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import Swal from "sweetalert2";

import { ConvertFechaPipe } from '../../pipes/convert-fecha.pipe';
import { FormControl, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';


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

  parametroCliente: string; //Parametro que viene desde el componente de Administracion de Clientes.

  //Formulario reactivo para filtros personalizados

  myGroup = new FormGroup({
    idFilter: new FormControl(),
    nombreFilter: new FormControl(),
    apellidoFilter: new FormControl(),
    fechaFilter: new FormControl(),
    stateFilter: new FormControl()
  });

  filteredValues = {id: '', nombre: '', apellido: '', fecha: '', state: ''}
  
  constructor( private router:Router,
               private authService: AuthService,
               private ventasServices:  VentasService,
               private modalService: NgbModal,
               private convertFecha: ConvertFechaPipe,
               private route: ActivatedRoute,
               private datePipe: DatePipe ) { }

  ngOnInit(): void {
    
    
    this.obtenerVentas();
    this.myGroup.patchValue({
      stateFilter: ""
    });

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

      this.ventas.forEach(element => {
        element.fechaOperacion = this.convertFecha.transform(element.fechaOperacion)

      });
      /* this.data.data = this.ventas */
      this.data = new MatTableDataSource(this.ventas)
      
      this.myGroup.controls.idFilter.valueChanges.subscribe (
        (positionFilterValue) => {
          this.filteredValues['id'] = positionFilterValue;
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

      this.data.filterPredicate = this.customPredicate();

      


      this.data.paginator = this.paginator;

      this.data.sortingDataAccessor = (obj, property) => this.getProperty(obj, property); 
      

      this.data.sort = this.sort;

      this.route.paramMap.subscribe((params: ParamMap) => {
        this.key = params.get('cliente')
        const filterValue = params.get('cliente')
        this.data.filter = filterValue?.trim().toLowerCase();
        
      });

      console.log(this.ventas);
    })
  };

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.data.filter = filterValue.trim().toLowerCase();
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
  );

  
  //Funcion para modificar el FilterPredicate por defecto que viene con Angular Material, con la finalidad de hacer los filtros personalizados
  customPredicate(){

    const myFilterPredicate = function(data:Operacion, filter:any) :boolean{

      let searchString = JSON.parse(filter);
      console.log(searchString);
      
      let idFound = data.nroOperacion.toString().trim().toLowerCase().indexOf(searchString.id.toLowerCase()) !== -1
      let nombreFound = data.cliente.nombre.toString().trim().toLowerCase().indexOf(searchString.nombre.toLowerCase()) !== -1
      let apellidoFound = data.cliente.apellido.toString().trim().toLowerCase().indexOf(searchString.apellido.toLowerCase()) !== -1
      let fechaFound = data.fechaOperacion.toString().trim().toLowerCase().indexOf(searchString.fecha.toLowerCase()) !== -1
      let stateFound = data.estado.toString().trim().toLowerCase().indexOf(searchString.state.toLowerCase()) !== -1
      
      if (searchString.topFilter) {
        return idFound || nombreFound || apellidoFound || fechaFound || stateFound 
      } else {
        return idFound && nombreFound && apellidoFound && fechaFound && stateFound 
      }

    }

    return myFilterPredicate;

  };

  //Funcion para resetear el formulario reactivo (filtros)

  resetFilters(){
    this.myGroup.setValue({
      idFilter: "",
      nombreFilter: "",
      apellidoFilter: "",
      fechaFilter: "",
      stateFilter: ""
    })
  };

  parseFechaTime(date: any) {

    let myDate = date.split("-");
    let newDate = new Date(myDate[2], myDate[1] - 1, myDate[0])

    return newDate

  };

  transformDate(){
    console.log("entra");
    
    this.myGroup.controls.fechaFilter.setValue(this.datePipe.transform(this.myGroup.controls.fechaFilter.value))
  }

  

}
