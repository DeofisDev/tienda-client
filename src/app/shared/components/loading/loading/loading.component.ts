import { Component, OnInit, Input } from '@angular/core';

import { ngxLoadingAnimationTypes, NgxLoadingComponent } from '../../../../../../node_modules/ngx-loading';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {

  @Input() load: boolean = false
  //Variables para mostrar spinner mientras se realiza la llamada al servidor
  loading: boolean = false;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;

  constructor() { }

  ngOnInit(): void {
  }

}
