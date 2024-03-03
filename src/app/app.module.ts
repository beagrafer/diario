import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { enviroment } from 'enviroments/environment';;
import { provideAuth, getAuth } from '@angular/fire/auth';
import { LoginComponent } from './components/login/login.component';
import { AngularFireModule } from '@angular/fire/compat';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { MapaComponent } from './components/mapa/mapa.component';
import { MainComponent } from './components/main/main.component';
import { RegisterComponent } from './components/register/register.component';
import { provideFirestore } from '@angular/fire/firestore';
import { getFirestore } from 'firebase/firestore';
import { HistoriaComponent } from './components/historia/historia.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Calendar, CalendarModule } from '@syncfusion/ej2-angular-calendars';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { DiarioComponent } from './components/diario/diario.component';

@NgModule({
  //Declaración de componentes
  declarations: [
    AppComponent,
    LoginComponent,
    SignUpComponent,
    MainComponent,
    RegisterComponent,
    MapaComponent,
    HistoriaComponent,
    DiarioComponent
  ],
  // Importación de módulos
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CalendarModule,
    AngularFireModule.initializeApp(enviroment.firebase),
    provideFirebaseApp(() => initializeApp(enviroment.firebase)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    provideFirebaseApp(() => initializeApp(enviroment.firebase)),
    provideStorage(() => getStorage())
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }



