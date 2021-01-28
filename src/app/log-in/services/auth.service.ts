import { Cliente } from './../clases/cliente/cliente';
import { Injectable, Output, EventEmitter } from '@angular/core';
import { API_BASE_URL } from 'src/app/config/config';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SignupRequest } from '../clases/signup.request';
import { IniciarSesionRequest } from '../clases/login-request';
import { map, tap } from 'rxjs/operators';
import { AuthResponse } from '../clases/auth-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  urlEndpoint: string;
  
  /**
   * Estos event emmiters nos serviran para notificar a todos los subscriptores que se realizaron cambios
   * cada vez que alguien se loguee, o desloguee.
   */
  @Output() loggedIn: EventEmitter<boolean> = new EventEmitter();
  @Output() useremail: EventEmitter<string> = new EventEmitter();

  constructor(private http: HttpClient) {
    this.urlEndpoint = `${API_BASE_URL}/api/auth`;
  }

  /**
   * Este servicio nos provee la petición a la API para registrar un nuevo usuario.
   * @param signupRequest SignupRequest con los datos para el registro de usuario: email y password.
   */
  signup(signupRequest: SignupRequest): Observable<any> {
    return this.http.post(`${this.urlEndpoint}/signup`, signupRequest);
  }

  /**
   * Servicio que se encarga de iniciar sesión en la App, y guardar los datos de autenticacion
   * que recibe del backend de sesión en local storage.
   * @param usuario IniciarSesionRequest con los datos credenciales del usuario para iniciar sesión.
   */
  login(usuario: IniciarSesionRequest): Observable<any> {
    return this.http.post(`${this.urlEndpoint}/login`, usuario).pipe(
      map(( response:any ) => {
        localStorage.setItem('authToken', response.authToken);
        localStorage.setItem('userEmail', response.userEmail);
        localStorage.setItem("refreshToken", response.refreshToken);
        localStorage.setItem("rol", response.rol);
        localStorage.setItem("expiraEn", response.expiraEn);

        this.loggedIn.emit(true);
        this.useremail.emit(response.userEmail);

        return response;
      })
    );
  }

  /**
   * Servicio que cierra sesión. Elimina los datos del local storage del navegador, y llama a la API que completa el
   * cierre de sesión (elimina el refresh token).
   */
  logout() {
    const refreshTokenPayload = {
      refreshToken: this.getRefreshToken(),
      userEmail: this.getEmailUser()
    };

    return this.http.post(`${this.urlEndpoint}/logout`, refreshTokenPayload, {responseType: 'text'}).pipe(
      tap(response => {
        this.loggedIn.emit(false);
        this.useremail.emit(null);
        localStorage.clear();
        
        return response;
      }));
    
  }

  /**
   * Servicio que, en caso de que la sesión de un usuario haya expirado y realice otra
   * petición al servidor, genere un nuevo JWT para continuar y extender su sesión.
   * @return Observable<AuthResponse> retorna un flujo de datos con el nuevo objeto Auth Response,
   * con los datos: nuevo JWT, nuevo tiempo de expiración.
   * NOTA: Al refrescar el token, el resto de datos cargados en local storage (rol, userEmail...) 
   * quedan exactamente igual, por ende, no es necesario actualizar estos datos.
   */
  refreshToken(): Observable<AuthResponse> {
    const refreshTokenPayload = {
      refreshToken: this.getRefreshToken(),
      userEmail: this.getEmailUser()
    };

    return this.http.post<AuthResponse>(`${this.urlEndpoint}/refresh/token`, refreshTokenPayload).pipe(
      tap(response => {
        localStorage.setItem('authToken', response.authToken);
        localStorage.setItem('expiraEn', response.expiraEn);  
      })
    );
  }

  /**
   * Servicio que se encarga de hacer una petición al servidor para recuperar la contraseña en caso
   * de haberla olvidado.
   * <br>
   * Inicia el flujo de recuperación de contraseña, para el email requerido.
   * @param email string email requerido a recuperar contraseña. 
   */
  recuperarContraseña(email: string): Observable<string> {
    let params = new HttpParams();
    params = params.append("email", email);
    return this.http.get(`${this.urlEndpoint}/recuperar-password`, {params: params, responseType: 'text'});
  }

  /**
   * Servicio que se encarga de enviar petición al servidor con la nueva contraseña del usuario, y el token
   * para validar que es el mismo usuario quien hace la petición (token generado y enviado al mail).
   * <br>
   * Completa el flujo de recuperación de contraseña.
   * @param password string nueva contraseña.
   * @param token string token de validación.
   */
  cambiarContraseña(password: string, token: string): Observable<string> {
    const cambiarPassRequest = {
      password: password
    };

    return this.http.post(`${this.urlEndpoint}/cambiar-password/${token}`, cambiarPassRequest,{responseType: 'text'});
  }

  /**
   * Devuelve el JsonWebToken guardado en local storage. Si no existe, devuelve null.
   * @return string con el JWT.
   */
  getJwt(): string {
    return localStorage.getItem('authToken');
  }

  /**
   * Devuelve el refresh token en local storage que sirve para extender la sesión del usuario actual.
   * @return string con refresh token.
   */
  getRefreshToken(): string {
    return localStorage.getItem('refreshToken');
  }

  /**
   * Devuelve el email del usuario actual guardado en local storage.
   * @return string user email.
   */
  getEmailUser(): string {
    return localStorage.getItem('userEmail');
  }

  /**
   * Verifica que exista un JWT guardado, y por ende, que exista una sesión actual.
   * @return boolean true --> logueado, false --> no logueado.
   */
  isLoggedIn(): boolean {
    return this.getJwt() != null;
  }

  /**
   * Valida que el rol pasado por parámetro sea el mismo que posee el usuario con
   * sesión actual.
   * @param role string con el rol a verificar.
   * @return boolean true --> el rol es el mismo, false --> no es el mismo.
   */
  hasRole(role: string) {
    return localStorage.getItem('rol') == role;
  }

  emitUserAndLogged(userEmail: string): void {
    this.loggedIn.emit(true);
    this.useremail.emit(userEmail);
  }

}
