import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UsersService } from '../users.service';

import { Usuario } from './clases/Usuario';

import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import {MatSnackBar} from '@angular/material/snack-bar';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Rol } from './clases/rol';

import { ngxLoadingAnimationTypes, NgxLoadingComponent } from '../../../../node_modules/ngx-loading';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit {

  usuarios: Usuario[] = [];

  usuarioAEditar: Usuario; //Usuario seleccionado para editar rol y/o estado.

  formEditarEstadoUsuario: FormGroup;
  formEditarRolUsuario: FormGroup;

  roles: Rol[] = [];

  page_size: number = 5;
  page_number:number = 1;
  pageSizeOptions = [5, 10, 20, 50]
  arrow:boolean;
  filterPromos ='';

  columnsToDisplay = ['id', 'email', 'rol', 'enabled', 'fechaCreacion', 'authProvider', 'tools'];
  data = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  //registros
  registrosRol: any[] = []; //Listado de cambios de rol
  registrosEstado: any[] = []; //Listado de cambios de estado (activo/inactivo) de usuarios

  //Variables para mostrar spinner mientras se realiza la llamada al servidor
  loading: boolean = false;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;

  constructor( private usuariosServices: UsersService,
               private modalService: NgbModal,
               private fb: FormBuilder,
               private snackBar: MatSnackBar ) { }

  ngOnInit(): void {

    this.obtenerListadoUsuarios();
    this.obtenerListadoRoles();
    this.usuarioAEditar = new Usuario();

    this.obtenerResgistroDeCambios();

    

  }

  obtenerListadoUsuarios(){

    this.usuariosServices.getUsuarios().subscribe(resp => {
      
      this.usuarios = resp;
      this.data.data = this.usuarios;
      this.data.paginator = this.paginator;
      this.data.sort = this.sort;
      console.log(this.usuarios);
      
      
    })

  };

  obtenerListadoRoles(){

    this.usuariosServices.getRolesUsuarios().subscribe(resp => {
      
      this.roles = resp;
      console.log(this.roles);
      

    })

  };

  open(contenido){

    this.modalService.open(contenido, { scrollable: true, centered: true});

  };

  openLg(contenido){

    this.modalService.open(contenido, { scrollable: true, size: 'lg'});

  };

  //Formulario y logica edicion estado de un usuario.

  crearFormEditarEstadoUsuario(){

    this.formEditarEstadoUsuario = this.fb.group({
      estado: [this.usuarioAEditar.enabled]
    })

  };

  cambiarEstadoUsuario(){

    console.log(this.formEditarEstadoUsuario);
    
    //Validador del formulario
    if (this.formEditarEstadoUsuario.invalid) {

      return Object.values(this.formEditarEstadoUsuario.controls).forEach(control => {

        if (control instanceof FormGroup) {
          Object.values(control.controls).forEach(control => control.markAsTouched());
        } else {
          control.markAsTouched();
        }
      });
    };

    this.loading = true;

    if (!this.formEditarEstadoUsuario.get('estado').value) {
      this.usuariosServices.habilitarUsuario(this.usuarioAEditar.email).subscribe(resp => {
        console.log(resp);
        this.usuarioAEditar.enabled = true;
        this.loading = false;
        this.openSnackBar(`Usuario habilitado con éxito`, null)

        
      })
    }else{
      this.usuariosServices.deshabilitarUsuario(this.usuarioAEditar.email).subscribe(resp => {
        console.log(resp);
        this.usuarioAEditar.enabled = false;
        this.loading = false;
        this.openSnackBar(`Usuario inhabilitado con éxito`, null)
      })
    }

  }


  //Formulario y logica edicion rol de un usuario.

  crearFormEditarRolUsuario(){

    this.formEditarRolUsuario = this.fb.group({
      rol: [this.usuarioAEditar.rol]
    });

  };

  editarRolUsuario(){
   
    console.log(this.formEditarRolUsuario);
    
    //Validador del formulario
    if (this.formEditarRolUsuario.invalid) {

      return Object.values(this.formEditarRolUsuario.controls).forEach(control => {

        if (control instanceof FormGroup) {
          Object.values(control.controls).forEach(control => control.markAsTouched());
        } else {
          control.markAsTouched();
        }
      });
    };

    this.loading = true;

    const rolDto = {
      rolId: this.idRol(this.formEditarRolUsuario.get('rol').value),
      usuarioEmail: this.usuarioAEditar.email
    };

    console.log(rolDto);
    

    this.usuariosServices.cambiarRolUsuario(rolDto).subscribe(resp => {
      console.log(resp);
      this.usuarioAEditar.rol = resp.nuevoRol;
      this.loading = false;
      this.openSnackBar( `Se cambió el rol del usuario a: ${this.usuarioAEditar.rol}`, null)
      
    });

   
    
  };

  idRol(nombreRol: string): number{

    for (let i = 0; i < this.roles.length; i++) {
     
      if (nombreRol === this.roles[i].nombre) {
        return this.roles[i].id
      }
      
    }

  };


  obtenerResgistroDeCambios(){

    this.usuariosServices.registroDeCambiosDeEstadosUsuarios().subscribe(resp => {
      this.registrosEstado = resp;
      console.log(this.registrosEstado);
      
    });

    this.usuariosServices.registroDeCambiosDeRol().subscribe(resp => {
      this.registrosRol = resp;
      console.log(this.registrosRol);
      
    });

  };


  openSnackBar(message: string, action:string){
    this.snackBar.open(message, action, {duration: 2500, panelClass: ['snackPerfil']})
  };

}
