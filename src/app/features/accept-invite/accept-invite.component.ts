import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import axios from 'axios';
import { environment } from '../../../environments/environment';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-accept-invite',
  templateUrl: './accept-invite.component.html',
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatInputModule,
    MatListModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatDividerModule,
    MatExpansionModule,
    MatSidenavModule,
    ReactiveFormsModule,
  ],
})
export class AcceptInviteComponent implements OnInit {
  passwordForm!: FormGroup;
  token: string | null = null;
  loading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  apiUrl = environment.apiUrl;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.passwordForm = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(8)]],
        password_confirmation: ['', Validators.required],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );

    // Get the token from the URL
    this.token = this.route.snapshot.queryParamMap.get('token');

    if (!this.token) {
      this.errorMessage = 'رمز الدعوة غير صالح أو مفقود.';
      return;
    }
  }

  passwordMatchValidator(group: AbstractControl) {
    const password = group.get('password');
    const confirm = group.get('password_confirmation');
  
    if (!password || !confirm) return null;
  
    if (password.value !== confirm.value) {
      confirm.setErrors({ mismatch: true });
      return { mismatch: true };
    } else {
      // Only clear if the error was 'mismatch'
      if (confirm.hasError('mismatch')) {
        confirm.setErrors(null);
      }
      return null;
    }
  }

  async submit() {
    if (this.passwordForm.invalid || !this.token) return;

    this.loading = true;
    this.errorMessage = null;

    const payload = {
      token: this.token,
      password: this.passwordForm.value.password,
      password_confirmation: this.passwordForm.value.password_confirmation,
    };

    try {
      await axios.post(this.apiUrl + 'accept-invite', payload);
      this.successMessage = 'تم تفعيل حسابك بنجاح. سيتم إعادة توجيهك قريبًا...';
      this.snackBar.open(this.successMessage, 'إغلاق', { duration: 3000 });
      setTimeout(() => this.router.navigate(['/login']), 2500);
    } catch (error: any) {
      this.errorMessage = error.response?.data?.message || 'حدث خطأ ما.';
      this.snackBar.open(this.errorMessage || 'حدث خطأ أثناء العملية.', 'إغلاق', { duration: 3000 });
    } finally {
      this.loading = false;
    }
  }
}
