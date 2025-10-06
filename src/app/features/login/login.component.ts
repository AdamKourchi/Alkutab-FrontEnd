import { Component, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/authService.service';


@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
    RouterLink
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  authService = inject(AuthService);
  router = inject(Router);
  errorMessage: string | null = null;

  // Define the form group for the login form
  loginForm: FormGroup;

  constructor(private fb: FormBuilder) {
    // Initialize the form group with email and password controls
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login({ email, password }).subscribe(
        (res) => {
          const role = res.data.user.role;

          // Navigate based on the user's role
          if (role === 'admin') {
            this.router.navigate(['/admin/dashboard']);
          } else if (role === 'teacher') {
            this.router.navigate(['/teacher/dashboard']);
          } else {
            this.router.navigate(['/student/dashboard']);
          }
        },
        (error) => {
          // Handle 401 Unauthorized error
          if (error.status === 401) {
            this.errorMessage = 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
          } else {
            this.errorMessage = 'حدث خطأ غير متوقع. حاول مرة أخرى لاحقًا.';
          }
        }
      );
    }
  }
}
