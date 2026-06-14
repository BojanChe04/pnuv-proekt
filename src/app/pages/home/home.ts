import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent {
    isLoggedIn = false;
    constructor(private auth: Auth) {
      // Firebase автоматски проверува дали корисникот е најавен
      onAuthStateChanged(auth, (user) => {
      this.isLoggedIn = !!user; // true ако е најавен, false ако не е
    });
  }
}
