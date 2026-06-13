import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';


@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './auth.html',
  styleUrl: './auth.scss'
})
export class AuthComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  isLogin = true;
  name = '';
  email = '';
  password = '';
  errorMessage = '';
  loading = false;

  toggleMode() {
    this.isLogin = !this.isLogin;
    this.errorMessage = '';
  }

  async onSubmit() {
    this.loading = true;
    this.errorMessage = '';

    try {
      if (this.isLogin) {
        await this.authService.login(this.email, this.password);
      } else {
        await this.authService.register(this.email, this.password, this.name);
      }
      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      this.errorMessage = error.message;
    } finally {
      this.loading = false;
    }
  }
}
