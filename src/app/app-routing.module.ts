import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { MainComponent } from './components/main/main.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { HistoriaComponent } from './components/historia/historia.component';
import { DiarioComponent } from './components/diario/diario.component';

//Aquí se definen las redirecciones mediante enrutamiento a los diferentes componentes.
const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'sign-up', component: SignUpComponent},
  { path: 'historia', component: HistoriaComponent},
  { path: 'mapa', component: MainComponent},
  { path: 'diario', component: DiarioComponent},
  { path: 'main', component: MainComponent, canActivate: [AuthGuard] }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }