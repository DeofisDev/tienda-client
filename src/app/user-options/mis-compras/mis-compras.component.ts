import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/log-in/services/auth.service';
import {animate, state, style, transition, trigger} from '@angular/animations';

import { ComprasService } from '../compras.service';
import { Operacion } from 'src/app/admin-options/admin-ventas/clases/Operacion';

import { MatSort } from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

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
  columnsToDisplay = ['nroOperacion', 'direccion.calle', 'fechaOperacion', 'fechaEnvio', 'fechaEntrega', 'estado', 'medioPago.nombre', 'total', 'tools'];
  data = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

 constructor( private comprasServices: ComprasService ) {

   }

  ngOnInit(): void {

    this.obtenerCompras();

  }

  showDetail1(){
    ///// *** **** MOSTRAR DETALLE COMPRA *** *** /////
    let detail = document.getElementById("compra1") ;
    detail.style.display="block";
   
    ///// *** **** SUBRAYADO *** *** /////
    let border = document.getElementById("cont-compra1") ;
    border.style.borderBottom="1px solid rgb(221, 213, 213)";
    
    ///// *** **** FLECHAS *** *** /////
    let arrowDown1=document.getElementById("down1");
    arrowDown1.style.display="none";
    
    let arrowUp1=document.getElementById("up1");
    arrowUp1.style.display="block";
  }

  hideDetail1(){
    ///// *** **** MOSTRAR DETALLE COMPRA *** *** /////
    let detail = document.getElementById("compra1") ;
    detail.style.display="none";
    
    ///// *** **** SUBRAYADO *** *** /////
    let border = document.getElementById("cont-compra1") ;
    border.style.borderBottom="none";
    
    ///// *** **** FLECHAS *** *** /////
    let arrowDown1=document.getElementById("down1")
    arrowDown1.style.display="block";

    let arrowUp1=document.getElementById("up1");
    arrowUp1.style.display="none";
}
  showDetail2(){
    ///// *** **** MOSTRAR DETALLE COMPRA *** *** /////
    let detail = document.getElementById("compra2") ;
    detail.style.display="block";
    
    ///// *** **** SUBRAYADO *** *** /////
    let border = document.getElementById("cont-compra2") ;
    border.style.borderBottom="1px solid rgb(221, 213, 213)";
    
    ///// *** **** FLECHAS *** *** /////
    let arrowDown2=document.getElementById("down2")
    arrowDown2.style.display="none"
    
    let arrowUp2=document.getElementById("up2")
    arrowUp2.style.display="block"
  }

  hideDetail2(){
    ///// *** **** MOSTRAR DETALLE COMPRA *** *** /////
    let detail = document.getElementById("compra2") ;
    detail.style.display="none";
    ///// *** **** SUBRAYADO *** *** /////
    let border = document.getElementById("cont-compra2") ;
    border.style.borderBottom="none";
    
    ///// *** **** FLECHAS *** *** /////
    let arrowDown1=document.getElementById("down2")
    arrowDown1.style.display="block"
    
    let arrowUp1=document.getElementById("up2");
    arrowUp1.style.display="none"
  }

  obtenerCompras(){
    this.comprasServices.getVentasUser().subscribe((resp:any) => {
      this.misCompras = resp;
      this.data.data = this.misCompras;
      this.data.sort = this.sort;
      this.data.paginator = this.paginator;

      console.log(this.misCompras);
      
    })
  };

  completarPago(operacion: Operacion): void {
    const nroOperacion = operacion.nroOperacion;
    
    this.comprasServices.completarPago(nroOperacion).subscribe(payment => {
      console.log(payment);
      window.open(payment.approveUrl, "_self")
    }, err => {
      console.log(err);
    });
  }

}
