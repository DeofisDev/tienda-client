import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../log-in/services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
showForm2:boolean = false
  constructor( private router:Router,
    private authService: AuthService,) { 
     
}

  ngOnInit(): void {
  }
  showLateralMenu(){
    if (screen.width>650) {
    let lateralmenu=document.getElementById("lateralMenu");
    lateralmenu.style.width="200px";
    let menu = document.getElementById("lateral-container");
    menu.style.display="block";
    let arrow= document.getElementById("botonMenu");
    arrow.style.display="none"
    } else{
     let lateralmenu=document.getElementById("lateralMenu");
     lateralmenu.style.opacity="0.9"
     lateralmenu.style.width="100%"
      let menu = document.getElementById("lateral-container");
       menu.style.display="block";
      let close = document.getElementById("close-menu");
      close.style.display="block";
      close.style.marginLeft="15px";
      close.style.fontSize="0.8em";
      let arrow = document.getElementById("open-menu");
      arrow.style.display="none"
    }
  }
  hiddeLateralMenu(){
    let lateralmenu=document.getElementById("lateralMenu");
    lateralmenu.style.width="30px";
    let menu = document.getElementById("lateral-container");
    menu.style.display="none";
    let boton = document.getElementById("botonMenu");
    boton.style.display="block";
    let close = document.getElementById("close-menu");
    close.style.display="none";
    let arrow = document.getElementById("open-menu");
    arrow.style.display="block";
  }
  /**
   * Cerrar sesión y eliminar datos de la misma.
   */
  logout(): void {
    this.authService.logout();
    
    this.router.navigate(['/home']);
  }


  addProperty(){
    alert("agregando atributo")
  }

  ///// *** *** Show step 2 ****** ///7
  showStep2(){
    let step2= document.getElementById("step2");
    if(this.showForm2 == false){
      step2.style.display="block";
      this.showForm2=true;
    }else {
      step2.style.display="none";
      this.showForm2=false;
    }
  
  }
}
