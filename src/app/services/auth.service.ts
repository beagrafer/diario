import { Injectable, NgZone } from '@angular/core';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userData: any;

  email?: string;
  displayName?: string;
  id?: string;

  constructor(
    private firebaseAuthenticationService: AngularFireAuth,
    private router: Router,
    private ngZone: NgZone
  ){
    this.firebaseAuthenticationService.authState.subscribe((user) => {
      if (user) {
        // Si estoy autenticado guardo el usuario en la localStorage
        this.userData = user;
        if (user.email != null){this.email = user.email;}
        if (user.displayName != null) {this.displayName = user.displayName}
        if (user.uid != null) {this.id = user.uid}
        localStorage.setItem('user', JSON.stringify(this.userData));
      } else {
        localStorage.setItem('user', 'null');
      }
    })
  }

  // Logeo con email y password. Funciones que provee GoogleAuth de Firebase
  logInWithEmailAndPassword(email: string, password: string) {
    return this.firebaseAuthenticationService.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        this.userData = userCredential.user
        this.observeUserState()
      })
      .catch((error) => {
        alert(error.message);
      })
  }

  // Logeo con GoogleProvider. Funciones que provee GoogleAuth de Firebase
  logInWithGoogleProvider() {
    return this.firebaseAuthenticationService.signInWithPopup(new GoogleAuthProvider())
      .then(() => this.observeUserState())
      .catch((error: Error) => {
        alert(error.message);
      })
  }

  // Registro con email y password. Funciones que provee GoogleAuth de Firebase
  signUpWithEmailAndPassword(email: string, password: string) {
    return this.firebaseAuthenticationService.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        this.userData = userCredential.user
        this.observeUserState()
      })
      .catch((error) => {
        alert(error.message);
      })
  }

  // Redirección al componente main mediante el enrutamiento de angular
  observeUserState() {
    this.firebaseAuthenticationService.authState.subscribe((userState) => {
      userState && this.ngZone.run(() => this.router.navigate(['main']))
    })
  }

  // Comprobar si el usuario está logeado mediante la lectura del localStorage
  get isLogedIn(): boolean{
    const user = JSON.parse(localStorage.getItem('user')!)
    return user !==null;
}

  // Logout de la herramienta, eliminando del localStorage y redirigiendo a la pantalla de login.
  logOut() {
    return this.firebaseAuthenticationService.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['login']);
    })
  }
}