import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private authService: AuthService) {

  }

  // Método de login con email y password
  logIn(email: string, password: string) {
    this.authService.logInWithEmailAndPassword(email, password);
  }

  // Método de login mediante google provider
  logInWithGoogle() {
    this.authService.logInWithGoogleProvider();
  }
}