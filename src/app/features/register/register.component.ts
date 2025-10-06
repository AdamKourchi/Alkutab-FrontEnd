import { Component, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

import { Router } from '@angular/router';
import { AuthService } from '../../core/services/authService.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { merge } from 'rxjs';

@Component({
  selector: 'app-register',
  imports: [    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule,],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  authService = inject(AuthService);
  router = inject(Router);
  errorMessage: string | null = null;

   // Define the form group for the registration form
   registerForm: FormGroup;

   constructor(private fb: FormBuilder) {
     // Initialize the form group with name, email, password, and confirm password controls
     this.registerForm = this.fb.group({
       name: ['', [Validators.required, Validators.minLength(3)]],
       email: ['', [Validators.required, Validators.email]],
       password: ['', [Validators.required, Validators.minLength(6)]],
       password_confirmation: ['', [Validators.required]],
     });
   }
 
   onSubmit() {
     if (this.registerForm.valid) {
       const { name, email, password, password_confirmation } = this.registerForm.value;
 
       // Check if passwords match
       if (password !== password_confirmation) {
         this.errorMessage = 'كلمتا المرور غير متطابقتين';
         return;
       }
 
       // Call the registration service
       this.authService.register({ name, email, password }).subscribe(
         (res) => {
           // Navigate to the login page after successful registration
           this.router.navigate(['/login']);
         },
         (error) => {
           // Handle errors
           if (error.status === 422) {
             this.errorMessage = 'البريد الإلكتروني مستخدم بالفعل';
           } else {
             this.errorMessage = 'حدث خطأ غير متوقع. حاول مرة أخرى لاحقًا.';
           }
         }
       );
     }
   }
 

}
