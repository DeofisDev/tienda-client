import { Pipe, PipeTransform } from '@angular/core';



@Pipe({
  name: 'noimage'
})
export class NoimagePipe implements PipeTransform {

  transform(images: any): string {

    
    if (!images){
      return 'assets/imagenes/noimage.png';
    }else{
      return images
    }

/*     if (images.length > 0) {

      return images[0].url;
      
    }else{
      return '../../assets/imagenes/noimage.png';
    } */

    return null;
  }

}
