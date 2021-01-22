import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TokenInterceptor } from './token-interceptor';
import { BannerComponent } from './home/components/banner/banner.component';
import { AsideComponent } from './home/components/aside/aside.component';
import { ProductsComponent } from './products/components/products/products.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import Popper from 'popper.js';
import { environment } from "../environments/environment";
import { AngularFireModule } from "angularfire2";
import { AngularFireStorageModule } from "@angular/fire/storage";
import { HomeComponent } from './home/home.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { BuscadorComponent } from './home/components/buscador/buscador.component';
import { NormalHeaderComponent } from './shared/components/headers/normal-header/normal-header.component';
import { RouterModule } from '@angular/router';
import { UserProfileComponent } from './user-options/user-profile/user-profile.component';
import { AdminProfileComponent } from './admin-options/admin-profile/admin-profile.component';
import { ViewMoreComponent } from './products/components/products/view-more/view-more.component';
import { CardCarouselComponent } from './products/components/products/card-carousel/card-carousel.component';
import { CardGridComponent } from './products/components/products/card-grid/card-grid.component';
import { UserLoginComponent } from './log-in/user/user-login/user-login.component';
import { UserSignUpComponent } from './log-in/user/user-sign-up/user-sign-up.component';
import { Oauth2RedirectHandlerComponent } from './log-in/oauth2/oauth2-redirect-handler/oauth2-redirect-handler.component';
import { ShoppingCartComponent } from './cart/components/shopping-cart/shopping-cart.component';
import { CheckoutComponent } from './cart/components/checkout/checkout/checkout.component';
import { PreCheckoutComponent } from './cart/components/checkout/pre-checkout/pre-checkout.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BenefitsRowComponent } from './benefits-row/benefits-row/benefits-row.component';
import { FormLogInComponent } from './log-in/user/form-log-in/form-log-in.component';
import { MisComprasComponent } from './user-options/mis-compras/mis-compras.component';
import { NewPasswordComponent } from './log-in/user/new-password/new-password.component';
import { FavoritesComponent } from './user-options/favorites/favorites.component';
import { ActivatedMssgComponent } from './log-in/user/activated-mssg/activated-mssg.component';
import { ConfirmDataComponent } from './cart/components/confirm-data/confirm-data.component';
import { FmPaypalEnvioComponent} from './cart/components/final-message/paypal/fm-paypal-envio.component';
import { BrandsPanelComponent } from './admin-options/brands-panel/brands-panel.component';
import { ProductsListComponent } from './admin-options/products-list/products-list.component';
import { AddProductComponent } from './admin-options/add-product/add-product.component';
import { Step1Component } from './admin-options/add-product/step1/step1.component';
import { Step2Component } from './admin-options/add-product/step2/step2.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import{MatFormFieldModule}from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatStepperModule} from '@angular/material/stepper';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatButtonModule} from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort'; 
import { AdminPromosComponent } from './admin-options/admin-promos/admin-promos.component';
import { PaginatePipe } from './pipes/paginate.pipe';
import { SortPipe } from './pipes/sort.pipe';
import {MatListModule} from '@angular/material/list';
import { AdminVentasComponent } from './admin-options/admin-ventas/admin-ventas.component';
import { PromoSubcategoriaComponent } from './admin-options/admin-promos/promo-subcategoria/promo-subcategoria.component';
import { AdminSidebarComponent } from './admin-options/admin-sidebar/admin-sidebar.component';
import { UserSidebarComponent } from './user-options/user-sidebar/user-sidebar.component';
import { PromoProductoComponent } from './admin-options/admin-promos/promo-producto/promo-producto.component';
import { TablaProductosComponent } from './admin-options/admin-promos/promo-producto/tabla-productos/tabla-productos.component';
import { FormPromoProductComponent } from './admin-options/admin-promos/promo-producto/form-promo-product/form-promo-product.component';
import { NoimagePipe } from './pipes/noimage.pipe';
import { AdminPropiedadesComponent } from './admin-options/admin-propiedades/admin-propiedades.component';
import { PropiedadSubcategoriaComponent } from './admin-options/admin-propiedades/propiedad-subcategoria/propiedad-subcategoria.component';
import { FormPropiedadesComponent } from './admin-options/admin-propiedades/form-propiedades/form-propiedades.component';
import { TablaPromoSubComponent } from './admin-options/admin-propiedades/tabla-promo-sub/tabla-promo-sub.component';
import { ContenedorFormComponent } from './admin-options/add-product/contenedor-form/contenedor-form.component';
import { StepperCartComponent } from './cart/components/stepper-cart/stepper-cart.component';
import { MatIconModule } from '@angular/material/icon';
import {MatSnackBarModule} from  '@angular/material/snack-bar';
import { MatRippleModule } from '@angular/material/core';
import { ConvertFechaPipe } from './pipes/convert-fecha.pipe';
import { ConvertEstadoOpPipe } from './pipes/convert-estado-op.pipe';
import { DetalleDesktopComponent } from './admin-options/admin-ventas/detalle-desktop/detalle-desktop.component';
import { DetalleCompraDesktopComponent } from './user-options/mis-compras/detalle-compra-desktop/detalle-compra-desktop.component';
import { ResumenCarritoComponent } from './cart/components/checkout/resumen-carrito/resumen-carrito.component';
import { FmEfectivoComponent } from './cart/components/final-message/efectivo/fm-efectivo.component';
import { PaypalCancelComponent } from './cart/components/final-message/paypal-cancel/paypal-cancel.component';



@NgModule({
  declarations: [
    AppComponent,
    BannerComponent,
    AsideComponent,
    FooterComponent,
    ProductsComponent,
    HomeComponent,
    BuscadorComponent,
    NormalHeaderComponent,
    UserProfileComponent,
    AdminProfileComponent,
    ViewMoreComponent,
    CardCarouselComponent,
    CardGridComponent,
    UserLoginComponent,
    UserSignUpComponent,
    Oauth2RedirectHandlerComponent,
    BenefitsRowComponent,
    PreCheckoutComponent,
    CheckoutComponent,
    ShoppingCartComponent,
    FormLogInComponent,
    MisComprasComponent,
    NewPasswordComponent,
    FavoritesComponent,
    ActivatedMssgComponent,
    ConfirmDataComponent,
    FmPaypalEnvioComponent,
    BrandsPanelComponent,
    ProductsListComponent,
    AddProductComponent,
    Step1Component,
    Step2Component,
    AdminPromosComponent,
    PaginatePipe,
    SortPipe,
    AdminVentasComponent,
    PromoSubcategoriaComponent,
    AdminSidebarComponent,
    UserSidebarComponent,
    PromoProductoComponent,
    TablaProductosComponent,
    FormPromoProductComponent,
    NoimagePipe,
    AdminPropiedadesComponent,
    PropiedadSubcategoriaComponent,
    FormPropiedadesComponent,
    TablaPromoSubComponent,
    ContenedorFormComponent,
    StepperCartComponent,
    ConvertFechaPipe,
    ConvertEstadoOpPipe,
    DetalleDesktopComponent,
    DetalleCompraDesktopComponent,
    ResumenCarritoComponent,
    FmEfectivoComponent,
    PaypalCancelComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    ReactiveFormsModule,
    FormsModule,
    AngularFireStorageModule,
    HttpClientModule,
    RouterModule,
    NgbModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatListModule,
    MatStepperModule,
    MatIconModule,
    MatRippleModule,
    MatSnackBarModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true
  
  }],
  bootstrap: [AppComponent],
 
})
export class AppModule { }
