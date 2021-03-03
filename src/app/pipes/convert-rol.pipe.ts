import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertRol'
})
export class ConvertRolPipe implements PipeTransform {

  transform(rol: string): string {
    
    if (rol === "ROLE_USER") {
      return "Cliente"
    }else if(rol === "ROLE_ADMIN"){
      return "Administrador"
    }else {
      return rol
    }

  };

}
