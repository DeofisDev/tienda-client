import { Rol } from "./rol";


export class Usuario {

    authProvider: string;
    email: string;
    enabled: boolean;
    fechaCreacion: string;
    id: number;
    providerId: number;
    rol: Rol;

}