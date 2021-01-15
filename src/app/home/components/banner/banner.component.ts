import { Component, OnInit } from '@angular/core';
import { NgbCarouselConfig } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})

export class BannerComponent implements OnInit {
  images:any[]=[
    {
      name:'imagen 1',
      img:'../../../../assets/imagenes/publi2.png',
    },
   
  ]
  constructor(private _caruselconfig:NgbCarouselConfig) {
    _caruselconfig.interval=3000;
    _caruselconfig.pauseOnHover= true;
    _caruselconfig.showNavigationArrows= true
    _caruselconfig.wrap=true
   }

  ngOnInit(): void {
   
  }

  hideSlide(){
    let slider= document.getElementById("slider");
    console.log(slider);
    
  }
 


hideBanner(){
  
  let banner = document.getElementById("banner");
  banner.style.display="none";
}

}
