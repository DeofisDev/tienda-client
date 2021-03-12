import { CheckoutCancelComponent } from './cart/components/checkout/checkout-redirect/otros/cancel/checkout-cancel.component';
import { FmEfectivoComponent } from './cart/components/checkout/checkout-redirect/efectivo/fm-efectivo.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewMoreComponent } from './products/components/products/view-more/view-more.component';
import { HomeComponent } from './home/home.component';
import { UserLoginComponent } from './log-in/user/user-login/user-login.component';
import { BuscadorComponent } from './home/components/buscador/buscador.component';
import { UserProfileComponent } from './user-options/user-profile/user-profile.component';
import { UserSignUpComponent } from './log-in/user/user-sign-up/user-sign-up.component';
import { CheckoutComponent } from './cart/components/checkout/checkout/checkout.component';
import { StepperCartComponent } from './cart/components/stepper-cart/stepper-cart.component';
import { PreCheckoutComponent } from './cart/components/checkout/pre-checkout/pre-checkout.component';
import { ConfirmDataComponent } from './cart/components/confirm-data/confirm-data.component';
import { CheckoutRedirectComponent } from './cart/components/checkout/checkout-redirect/otros/success/checkout-redirect.component';
import { Oauth2RedirectHandlerComponent } from './log-in/oauth2/oauth2-redirect-handler/oauth2-redirect-handler.component';
import { AuthGuard } from './log-in/guards/auth.guard';
import { RoleGuard } from './log-in/guards/role.guard';
import { MisComprasComponent } from './user-options/mis-compras/mis-compras.component';
import { NewPasswordComponent} from "./log-in/user/new-password/new-password.component";
import { FavoritesComponent } from './user-options/favorites/favorites.component';
import { ActivatedMssgComponent } from './log-in/user/activated-mssg/activated-mssg.component';
import { AdminProfileComponent } from './admin-options/admin-profile/admin-profile.component';
import { BrandsPanelComponent } from './admin-options/brands-panel/brands-panel.component'
import { ProductsListComponent } from "./admin-options/products-list/products-list.component";
import { AddProductComponent } from "./admin-options/add-product/add-product.component";
import { AdminPromosComponent } from './admin-options/admin-promos/admin-promos.component';
import { AdminVentasComponent } from './admin-options/admin-ventas/admin-ventas.component';
import { AdminPropiedadesComponent } from './admin-options/admin-propiedades/admin-propiedades.component';
import { WebConfigurationComponent } from './admin-options/web-configuration/web-configuration/web-configuration.component';
import { AdminUsersComponent } from './admin-options/admin-users/admin-users.component';
import { AdminClientsComponent } from "./admin-options/admin-clients/admin-clients.component";
import { DetalleComponent } from './user-options/mis-compras/detalle/detalle.component';
import { NotfoundComponent } from './shared/components/notfound/notfound.component';

const admin = 'ROLE_ADMIN';
const user  = 'ROLE_USER';

const routes: Routes = [
  { path:"home",component:HomeComponent },
  { path:"viewmore/:id", component:ViewMoreComponent },
  { path:"login", component:UserLoginComponent },
  { path:'oauth2/redirect', component: Oauth2RedirectHandlerComponent },
  { path:"search/:termino", component:BuscadorComponent },
  { path:"user-profile",component:UserProfileComponent, canActivate: [AuthGuard, RoleGuard], data: {role: user} },
  { path:"user-my-purchases",component:MisComprasComponent, canActivate: [AuthGuard, RoleGuard], data: {role: user} },
  { path:"detalle/:nroOperacion", component: DetalleComponent, canActivate: [AuthGuard, RoleGuard], data: {role: user} },
  { path:"user-favorites", component:FavoritesComponent, canActivate: [AuthGuard, RoleGuard], data: {role: user} },
  { path:"admin-profile", component:AdminProfileComponent, canActivate: [AuthGuard, RoleGuard], data: {role: admin} },
  { path:"brands-panel" , component:BrandsPanelComponent, canActivate: [AuthGuard, RoleGuard], data: {role: admin} },
  { path:"sales",component:AdminVentasComponent, canActivate: [AuthGuard, RoleGuard], data: {role: admin} },
  { path:"sales/:cliente",component:AdminVentasComponent, canActivate: [AuthGuard, RoleGuard], data: {role: admin} },
  { path:"add-product",component:AddProductComponent, canActivate: [AuthGuard, RoleGuard], data: {role: admin} },
  { path:"products-list" , component:ProductsListComponent, canActivate: [AuthGuard, RoleGuard], data: {role: admin} },
  { path:"admin-promo", component:AdminPromosComponent/* , canActivate: [AuthGuard, RoleGuard], data: {role: admin} */ },
  { path:"admin-propiedades", component: AdminPropiedadesComponent, canActivate: [AuthGuard, RoleGuard], data: {role: admin} },
  { path:"web-configuration", component: WebConfigurationComponent, canActivate: [AuthGuard, RoleGuard], data: {role: admin} },
  { path:"users-admin", component: AdminUsersComponent, canActivate: [AuthGuard, RoleGuard], data: {role: admin}},
  { path:"adminClients", component: AdminClientsComponent, canActivate: [AuthGuard, RoleGuard], data: {role: admin}},
  { path:"user-sign-up",component:UserSignUpComponent },
  { path:"new-password", component:NewPasswordComponent},
  { path:"recuperar-password/:token",component:NewPasswordComponent },
  { path:"verify/redirect",component:ActivatedMssgComponent },
  { path:"shopping-cart",component:StepperCartComponent},
  // { path:"shopping-cart",component:ShoppingCartComponent, canActivate: [AuthGuard, RoleGuard], data: {role: user} },
  { path:"checkout",component:CheckoutComponent },
  { path:"pre-checkout", component:PreCheckoutComponent },
  { path:"confirm-data", component:ConfirmDataComponent },
  { path:"paypal/redirect/approved" , component:CheckoutRedirectComponent }, 
  { path:"paypal/redirect/cancel" , component: CheckoutCancelComponent }, 
  { path:"mercado-pago/redirect/approved" , component:CheckoutRedirectComponent }, 
  { path:"mercado-pago/redirect/cancel" , component: CheckoutCancelComponent }, 
  { path:"cash/approved" , component: FmEfectivoComponent },
  { path:"notfound", component: NotfoundComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  { path:"**", redirectTo:"notfound" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
