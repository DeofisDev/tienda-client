import { Marca } from './marca';
import { UnidadMedida } from './unidad-medida';
import { Subcategoria } from './subcategoria';
import { PropiedadProducto } from './propiedad-producto';
import { Sku } from './sku';
import { Promocion } from 'src/app/admin-options/admin-promos/clases/promocion';
import { Foto } from './foto';
import { ImagenSecundaria } from './imagen-secundaria';

export class Producto {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    promocion:Promocion;
    disponibilidadGeneral: number;
    fechaCreacion: number;
    foto: Foto;
    imagenes: ImagenSecundaria[];
    activo: boolean;
    destacado: boolean;
    subcategoria: Subcategoria;
    marca: Marca;
    unidadMedida: UnidadMedida;
    propiedades:PropiedadProducto[];
    defaultSku:Sku;
    skus:Sku[];
    vendibleSinPropiedades:boolean;
}
