import { Component, OnInit } from '@angular/core';
import { Operacion } from 'src/app/admin-options/admin-ventas/clases/Operacion';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { ComprasService } from '../../compras.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss']
})
export class DetalleComponent implements OnInit {

  nroOperacion: number
  operacion: Operacion

  constructor( private comprasServices: ComprasService,
               private route: ActivatedRoute ) { }

  ngOnInit(): void {

    this.operacion = new Operacion();

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.nroOperacion = + params.get('nroOperacion')
    })

    this.obtenerCompra();
    

  }

  obtenerCompra(){
    this.comprasServices.getCompra(this.nroOperacion).subscribe(resp => {
      this.operacion = resp.compra;
      console.log(this.operacion);
      
    })
  };

  completarPago(): void {
    
    this.comprasServices.completarPago(this.operacion.nroOperacion).subscribe(payment => {
      console.log(payment);
      window.open(payment.approveUrl, "_self")
    }, err => {
      console.log(err);
    });
  };

}
