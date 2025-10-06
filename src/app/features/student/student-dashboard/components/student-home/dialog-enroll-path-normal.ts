import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';

import { Path } from '../../../../../core/models/Path.model';
import { EnrollmentRequest } from '../../../../../core/models/EnrollmentRequest.model';
import { User } from '../../../../../core/models/User.model';


@Component({
  selector: 'dialog-enroll-path',
  templateUrl: './dialog-enroll-path-normal.html',
  styles: [`
    ::ng-deep .mat-mdc-dialog-container .mdc-dialog__surface {
      border-radius: 0px !important;
    }
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    .full-width {
      grid-column: 1 / -1;
    }
  `],
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatDividerModule,
    MatCheckboxModule
  ],
  standalone: true
})
export class DialogEnrollPathNormal {

  enrollForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DialogEnrollPathNormal>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { path: Path,user:User }
  ) {
    this.enrollForm = this.fb.group({
      educationLevel: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(5), Validators.max(100)]],
      goal: ['', [Validators.required, Validators.minLength(3)]],
      memorizeQuran: [false],

    });
  }

  onSubmit() {
    if (this.enrollForm.valid) {

      const user = new User(
        this.data.user.id,
        this.data.user.name,
        this.data.user.email,
        this.data.user.phone,
      )
      

      this.dialogRef.close({
        pathId: this.data.path.id,
        request:new EnrollmentRequest(
          null,
          user,
          this.data.path,
          this.enrollForm.value.educationLevel,
          this.enrollForm.value.goal,
          this.enrollForm.value.age,
          null,
          "hifd",
          "waiting",
          null,
          this.enrollForm.value.memorizeQuran,
        )
      });
    
    
      
    } else {
      this.snackBar.open('يرجى ملء جميع الحقول المطلوبة', 'إغلاق', {
        duration: 3000
      });
    }
  }
} 