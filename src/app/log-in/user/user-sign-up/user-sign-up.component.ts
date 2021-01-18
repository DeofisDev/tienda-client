import { Estado } from './../../clases/cliente/estado';
import { Direccion } from './../../clases/cliente/direccion';
import { Cliente } from './../../clases/cliente/cliente';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SignupRequest } from '../../clases/signup.request';
import { ValidadoresService } from '../../services/validadores.service';
import { AuthService } from '../../services/auth.service';
import { throwError } from 'rxjs';
import Swal from "sweetalert2";
import { CatalogoService } from 'src/app/products/services/catalogo.service';
import { Pais } from '../../clases/cliente/pais';
import { Ciudad } from '../../clases/cliente/ciudad';
@Component({
  selector: 'app-user-sign-up',
  templateUrl: './user-sign-up.component.html',
  styleUrls: ['./user-sign-up.component.scss']
})
export class UserSignUpComponent implements OnInit {

  formRegistro: FormGroup;
  // cliente:FormGroup;
  // direccion:FormGroup;
  signupRequest: SignupRequest;
  paises:Pais[];
  estados:Estado[];
  ciudades:Ciudad[];
  paisSeleccionado:Pais;
  
  constructor(private fb: FormBuilder,
    private router: Router,
    private catalogoservice:CatalogoService,
    private validadores: ValidadoresService,
    private authService: AuthService) {
    this.signupRequest = new SignupRequest();
  }

  ngOnInit(): void {
    /***** mostrar mensaje cta creada */
    this.crearFormulario();
    this.getPaises();   
  }
  ///////// obtener paises, estado ciudad ////
  getPaises(){
    this.catalogoservice.getPaises().subscribe( response =>{
      this.paises=response;
     })
  }
  
  
  showEstados(){
     this.paisSeleccionado = this.formRegistro.controls.cliente.get('direccion.pais').value;
     this.catalogoservice.getEstados(this.paisSeleccionado?.id).subscribe( response =>{
      this.estados=response;
     })

    let comboBoxEstados= document.getElementById("combobox-estados");
    comboBoxEstados.style.display="block";
  }
  showCiudades(){
    let estadoSeleccionado = this.formRegistro.controls.cliente.get('direccion.estado').value;
    
    this.catalogoservice.getCiudades(estadoSeleccionado?.id, this.paisSeleccionado.id).subscribe( response =>{
     this.ciudades=response;
    })

   let comboBoxEstados= document.getElementById("combobox-ciudades");
   comboBoxEstados.style.display="block";
 }
  //// ******** show psw *********///

  mostrarPsw1() {
    let input = document.getElementById("new-pasw") as HTMLInputElement;
    if (input.type == "password") {
      input.type = "text";
      let icon = document.getElementById("show1")
      icon.style.visibility = "hidden";
      let iconHide = document.getElementById("hide1");
      iconHide.style.visibility = "visible"
    } else {
      input.type = "password";
      let icon = document.getElementById("show1")
      icon.style.visibility = "visible";
      let iconHide = document.getElementById("hide1");
      iconHide.style.visibility = "hidden"
    }
  }
  mostrarPsw2() {
    let input = document.getElementById("new-pasw-repeat") as HTMLInputElement;
    if (input.type == "password") {
      input.type = "text";
      let icon = document.getElementById("show2")
      icon.style.visibility = "hidden";
      let iconHide = document.getElementById("hide2");
      iconHide.style.visibility = "visible"
    } else {
      input.type = "password";
      let icon = document.getElementById("show2")
      icon.style.visibility = "visible";
      let iconHide = document.getElementById("hide2");
      iconHide.style.visibility = "hidden"
    }
  }
  ///// show message
  showMessage() {
    let contRegistr = document.getElementById("ocultar") ;
     contRegistr.style.display = "none";
    let msj = document.getElementById("msje-registro");
    msj.style.display = "block";
  }

  /**
   * Crea el formulario a través de FormBuilder, con los campos:
   *                                        -email: obligatorio, patron de email @example.com
   *                                        -password: obligatorio
   */
  crearFormulario(): void {
    this.formRegistro = this.fb.group({
      // Expresion regular para verificar que sea un email correcto.
   
      email: ["", [Validators.required, Validators.pattern( '[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,5}')]],
      password: ["", [Validators.required, Validators.minLength(8)]],
      passwordRepeat: ["", Validators.required],
      checkterminos:["" ,Validators.required],
      cliente: this.fb.group({
        //id: [""],
        nombre: ["", Validators.required],
        apellido: ["", Validators.required],
        direccion: this.fb.group({
          ciudad:["", Validators.required],
          pais:["", Validators.required],
          estado:[""],
          calle:["", Validators.required],
          numeroCalle:["", Validators.required],
          piso:[""],
          codigoPostal:["", Validators.required],
          })
      }),
    }, {
      validators: this.validadores.passwordIguales('password', 'passwordRepeat')
    });
  }
  
  /**
   * Registra la nueva cuenta. Toma los datos de los campos del formulario, y si son validos, hace una peticion 
   * POST a la API de registrar usuario para completar el registro.
   */
  registrarse(): void {
    /*
    if (this.formRegistro.invalid) {
      return Object.values(this.formRegistro.controls)
        .forEach(control => control.markAsTouched());
    }*/

    if (this.formRegistro.invalid) {
      return this.formRegistro.markAllAsTouched();
    }

    this.signupRequest.email = this.formRegistro.controls.email.value;
    this.signupRequest.password = this.formRegistro.controls.password.value;
    this.signupRequest.cliente = this.formRegistro.controls.cliente.value;
    
    //console.log(this.formRegistro);
    console.log(this.signupRequest);
    
    this.authService.signup(this.signupRequest).subscribe(response => {
      console.log(response);
      
      this.showMessage();
    }, err => {
      Swal.fire({
        icon:'warning',
        title:'Usuario existente',
        text:"¡Ya existe el usuario!. Por favor,ingrese con su cuenta ó verifique su cuenta con su email.",
        showCloseButton:true,
        confirmButtonText:"Iniciar Sesión",
      }).then(() => {
        this.router.navigate(['/login']);
      });
    });
  }


  get nombreInvalido() {
    return this.formRegistro.get('cliente.nombre').invalid && this.formRegistro.get('cliente.nombre').touched;
  }

  get apellidoInvalido() {
    return this.formRegistro.get('cliente.apellido').invalid && this.formRegistro.get('cliente.apellido').touched;
  }
  get calleInvalida() {
    return this.formRegistro.controls.cliente.get('direccion.calle').invalid && this.formRegistro.controls.cliente.get('direccion.calle').touched;
  }
  get nroInvalido() {
    return this.formRegistro.get('cliente.direccion.numeroCalle').invalid && this.formRegistro.get('cliente.direccion.numeroCalle').touched;
  }
  get cpInvalido() {
    return this.formRegistro.get('cliente.direccion.codigoPostal').invalid && this.formRegistro.get('cliente.direccion.codigoPostal').touched;
  }
  get ciudadInvalida() {
    return this.formRegistro.get('cliente.direccion.ciudad').invalid && this.formRegistro.get('cliente.direccion.ciudad').touched;
  }
  get paisInvalido() {
    return this.formRegistro.get('cliente.direccion.pais').invalid && this.formRegistro.get('cliente.direccion.pais').touched;
  }
  get estadoInvalido() {
    return this.formRegistro.get('cliente.direccion.estado').invalid && this.formRegistro.get('cliente.direccion.estado').touched;
  }
 

  /**
   * Getter validador de email.
   * @return: true si el campo email es invalido y ha sido tocado.
   */
  get emailInvalido() {
    return this.formRegistro.get('email').invalid && this.formRegistro.get('email').touched;
  }
  get terminosInvalido() {
    return this.formRegistro.get('checkterminos').invalid && this.formRegistro.get('checkterminos').touched;
  }

  /**
   * Getter validador de password.
   * @return: true si el campo password es invalido y ha sido tocado.
   */
  get passwordInvalida() {
    return this.formRegistro.get('password').invalid && this.formRegistro.get('password').touched;
  }
  get passwordRepeatInvalida() {
    return this.formRegistro.get('passwordRepeat').invalid && this.formRegistro.get('passwordRepeat').touched;
  }

  /**
   * Getter validador de passwords iguales.
   * @return: true si las contraseñas NO son iguales.
   */
  get passwordNoIguales() {
    const pass1 = this.formRegistro.get('password').value;
    const pass2 = this.formRegistro.get('passwordRepeat').value;
    if (pass2 !== "" ) {
      return (pass1 === pass2) ? false : true;
    }
  }

}
