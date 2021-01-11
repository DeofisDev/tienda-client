import { NumberFormatStyle } from '@angular/common';
import { Promocion } from 'src/app/admin-options/admin-promos/clases/promocion';
import { Producto } from './producto';
import { ValorPropiedadProducto } from './valor-propiedad-producto';

export class Sku{
    id:number;
    nombre:string;
    descripcion:string;
    precio:number;
    promocion:Promocion;
    disponibilidad:number;
    valoresData:string;
    valores:ValorPropiedadProducto [];
    defaultProducto:Producto;
    producto:Producto;
    variedades:string;
    
}