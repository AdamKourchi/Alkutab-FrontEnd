import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Exam } from '../../core/models/Exam.model';

@Component({
  selector: 'app-view-exam-dialog',

  templateUrl: './view-exam-dialog.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ]
})
export class ViewExamDialog {
  constructor(
    public dialogRef: MatDialogRef<ViewExamDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { exam: Exam }
  ) {}
} 