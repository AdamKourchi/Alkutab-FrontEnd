import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { ProfileService } from '../../../../../core/services/profile.service';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule
  ],
  templateUrl: './student-profile.component.html',
  styleUrl: './student-profile.component.css'
})
export class StudentProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private profileService = inject(ProfileService);

  profileForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  });

  async ngOnInit() {
    await this.loadProfile();
  }

  async loadProfile() {
    try {
      const response = await this.profileService.getProfile('student');
      this.profileForm.patchValue({
        name: response.name
      });
    } catch (error) {
      this.snackBar.open('حدث خطأ أثناء تحميل البيانات', 'إغلاق', { duration: 3000 });
    }
  }

  async onSubmit() {
    if (this.profileForm.valid) {
      if (this.profileForm.get('newPassword')?.value !== this.profileForm.get('confirmPassword')?.value) {
        this.snackBar.open('كلمات المرور غير متطابقة', 'إغلاق', { duration: 3000 });
        return;
      }

      const data = {
        name: this.profileForm.get('name')?.value,
        currentPassword: this.profileForm.get('currentPassword')?.value,
        newPassword: this.profileForm.get('newPassword')?.value
      };

      try {
        await this.profileService.updateProfile('student', data);
        this.snackBar.open('تم تحديث الملف الشخصي بنجاح', 'إغلاق', { duration: 3000 });
        // Clear password fields after successful update
        this.profileForm.patchValue({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } catch (error) {
        this.snackBar.open('حدث خطأ أثناء تحديث البيانات', 'إغلاق', { duration: 3000 });
      }
    }
  }
}
