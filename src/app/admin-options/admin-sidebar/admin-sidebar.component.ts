import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/log-in/services/auth.service';
import Swal from 'sweetalert2';

import {MatAccordion} from '@angular/material/expansion';

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.scss']
})
export class AdminSidebarComponent implements OnInit {

  @ViewChild(MatAccordion) accordion: MatAccordion;

  constructor(private authService: AuthService, private router: Router) { }

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
    } else {
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

  logout(): void {
    this.authService.logout().subscribe(response => {
      Swal.fire({
        icon: 'success',
        title: 'Sesión Cerrada',
        text: response,
        width: '350px'
      }).then(() => this.router.navigate(['/home']));
    });
  }

}
