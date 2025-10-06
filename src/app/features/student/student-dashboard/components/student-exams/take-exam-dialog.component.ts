import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Exam } from '../../../../../core/models/Exam.model';
import { ExamsService } from '../../../../../core/services/exams.service';

@Component({
  selector: 'app-take-exam-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatSnackBarModule
  ],
  template: `
    <div class="flex justify-between items-center mx-5">
      <h2 mat-dialog-title>{{ data.exam.title }}</h2>
      <div class="flex gap-2">
        <button mat-button mat-dialog-close type="button">إلغاء</button>
        <button mat-flat-button color="primary" (click)="onSubmit()" [disabled]="examForm.invalid">
          تسليم
        </button>
      </div>
    </div>
    <mat-divider></mat-divider>

    <form [formGroup]="examForm" class="flex flex-col gap-4 mx-32 my-5">
      <div formArrayName="questions">
        @for(question of data.exam.questions; track question.id; let i = $index){
        <mat-card>
          <mat-card-content>
            <div class="mb-4">
              <h3 class="text-lg font-semibold">سؤال {{ i + 1 }}</h3>
              <p class="mt-2">{{ question.question }}</p>
            </div>

            <div [formGroupName]="i">
              @if(question.type === 'multiple_choice'){
              <mat-radio-group formControlName="answer">
                @for(option of question.options; track option.id){
                <mat-radio-button [value]="option.id" class="block mb-2">
                  {{ option.optionText }}
                </mat-radio-button>
                }
              </mat-radio-group>
              } @else {
              <mat-form-field class="w-full">
                <mat-label>إجابتك</mat-label>
                <textarea matInput formControlName="answer" rows="3"></textarea>
              </mat-form-field>
              }
            </div>
          </mat-card-content>
        </mat-card>
        }
      </div>
    </form>
  `,
  styles: `
  ::ng-deep .mat-mdc-dialog-container .mdc-dialog__surface {
    border-radius: 0px !important;
  }
  `
})
export class TakeExamDialog implements OnInit {
  examForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private examService: ExamsService,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<TakeExamDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { exam: Exam }
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    const questionsArray = this.fb.array(
      this.data.exam.questions?.map(question => 
        this.fb.group({
          answer: ['', Validators.required]
        })
      ) || []
    );

    this.examForm = this.fb.group({
      questions: questionsArray
    });
  }

  onSubmit() {
    if (this.examForm.invalid) return;



    const answers = this.examForm.value.questions;
    const examAnswers = this.data.exam.questions?.map((question, index) => ({
      question_id: question.id,
      answer: answers[index].answer
    })) || [];

    console.log(examAnswers);
    
    this.examService.submitExamAnswers(this.data.exam.id!, examAnswers)
      .then(() => {
        this._snackBar.open('تم تسليم الإجابات بنجاح', 'إغلاق', {
          duration: 3000,
        });
        this.dialogRef.close(true);
      })
      .catch(error => {
        console.error('Error submitting exam:', error);
        this._snackBar.open('حدث خطأ أثناء تسليم الإجابات', 'إغلاق', {
          duration: 3000,
        });
      });
  }
} 