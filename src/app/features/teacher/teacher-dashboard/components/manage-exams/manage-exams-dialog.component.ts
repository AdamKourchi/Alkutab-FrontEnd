import { Component, inject, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Course } from '../../../../../core/models/Course.model';
import { CoursesTeacherService } from '../../../../../core/services/teacher-courses.service';
import { Exam } from '../../../../../core/models/Exam.model';
import { ExamsService } from '../../../../../core/services/exams.service';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';

import 'moment/locale/ar';
import { ExamQuestionOption } from '../../../../../core/models/ExamQuestionOption.model';
import { ExamQuestion } from '../../../../../core/models/ExamQuestion.model';

@Component({
  selector: 'app-manage-exams',
  templateUrl: './manage-exams-dialog.html',
  styles: `
  ::ng-deep .mat-mdc-dialog-container .mdc-dialog__surface {
    border-radius: 0px !important;
  }
  `,
  imports: [
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    ReactiveFormsModule,
    MatRadioModule,
  ],
})
export class CreateExamDialog {
  readonly dialog = inject(MatDialog);
  examForm!: FormGroup;
  courseId!: number;
  course!: Course;

  questionTypes = [
    { value: 'multiple_choice', label: 'اختيار من متعدد' },
    { value: 'short_answer', label: 'إجابة قصيرة' },
    { value: 'text', label: 'نص طويل' },
  ];

  examTypes = [
    { value: 'oral', label: 'شفهي' },
    { value: 'written', label: 'تحريري' },
  ];

  private courseService = inject(CoursesTeacherService);
  private _snackBar = inject(MatSnackBar);
  private examsService = inject(ExamsService);

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateExamDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { courseId: number }
  ) {
    this.courseId = data.courseId;
  }

  ngOnInit() {
    this.initializeForm();

    // Subscribe to exam type changes to handle form updates
    this.examForm.get('examType')?.valueChanges.subscribe((type) => {
      this.onExamTypeChange(type);
    });

    this.fetchCourse();
  }

  private initializeForm() {
    this.examForm = this.fb.group({
      examType: ['written', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      isFinal: [false],

      // Written exam specific fields
      writtenExamDetails: this.fb.group({
        duration: ['', [Validators.required, Validators.min(1)]],
        questions: this.fb.array(
          [],
          [Validators.required, Validators.minLength(1)]
        ),
      }),

      // Oral exam specific fields
      oralExamDetails: this.fb.group({
        studentDuration: ['', [Validators.required, Validators.min(1)]],
        instructions: ['', Validators.required],
      }),
    });

    this.onExamTypeChange('written');
  }

  private onExamTypeChange(type: string) {
    const writtenDetails = this.examForm.get('writtenExamDetails') as FormGroup;
    const oralDetails = this.examForm.get('oralExamDetails') as FormGroup;

    if (type === 'written') {
      writtenDetails?.enable();
      oralDetails?.disable();
      // Force validation update on the written exam details
      if (writtenDetails) {
        Object.keys(writtenDetails.controls).forEach((key) => {
          const control = writtenDetails.get(key);
          control?.updateValueAndValidity({ onlySelf: false, emitEvent: true });
        });
      }
    } else {
      writtenDetails?.disable();
      oralDetails?.enable();
      // Force validation update on the oral exam details
      if (oralDetails) {
        Object.keys(oralDetails.controls).forEach((key) => {
          const control = oralDetails.get(key);
          control?.updateValueAndValidity({ onlySelf: false, emitEvent: true });
        });
      }
    }

    // Update the overall form validity
    this.examForm.updateValueAndValidity({ onlySelf: false, emitEvent: true });
  }

  fetchCourse() {
    this.courseService.fetchCourse(this.courseId).then((data) => {
      this.course = data;
    });
  }

  get questions() {
    return this.examForm.get('writtenExamDetails.questions') as FormArray;
  }

  addQuestion() {
    const questionForm = this.fb.group({
      type: ['multiple_choice', Validators.required],
      question: ['', Validators.required],
      points: [1, [Validators.required, Validators.min(1)]],
      options: this.fb.array([]),
      correctAnswer: ['', Validators.required],
    });

    // Subscribe to type changes to handle validation
    questionForm.get('type')?.valueChanges.subscribe((type) => {
      const correctAnswerControl = questionForm.get('correctAnswer');
      const optionsArray = questionForm.get('options') as FormArray;

      if (type === 'multiple_choice') {
        correctAnswerControl?.setValidators(Validators.required);
        this.addDefaultOptions(this.questions.length - 1);
      } else if (type === 'short_answer') {
        correctAnswerControl?.setValidators(Validators.required);
        optionsArray.clear();
      } else {
        // For text type questions
        correctAnswerControl?.clearValidators();
        optionsArray.clear();
      }

      correctAnswerControl?.updateValueAndValidity();
    });

    this.questions.push(questionForm);

    // If multiple choice, add default options
    if (questionForm.get('type')?.value === 'multiple_choice') {
      this.addDefaultOptions(this.questions.length - 1);
    }
  }

  private addDefaultOptions(questionIndex: number) {
    const optionsArray = this.questions
      .at(questionIndex)
      .get('options') as FormArray;
    for (let i = 0; i < 4; i++) {
      optionsArray.push(this.fb.control('', Validators.required));
    }
  }

  removeQuestion(index: number) {
    this.questions.removeAt(index);
  }

  getOptionsForQuestion(questionIndex: number): FormArray {
    return this.questions.at(questionIndex).get('options') as FormArray;
  }

  onSubmit() {
    if (this.examForm.valid) {
      const formValue = this.examForm.value;
      let questions: ExamQuestion[] = [];

      if(formValue.examType === 'written'){
      // Convert form questions to ExamQuestion objects
      questions = formValue.writtenExamDetails.questions.map((q: any) => {
        const options =
          q.type === 'multiple_choice'
            ? q.options.map(
                (optionText: string) =>
                  new ExamQuestionOption(null, null, optionText)
              )
            : null;

        return new ExamQuestion(
          null,
          null,
          q.type,
          q.question,
          q.correctAnswer?.toString(),
          options
        );
      });
    }
  console.log(this.course);

      const exam = new Exam(
        null,
        this.course,
        formValue.examType,
        formValue.title,
        formValue.description,
        formValue.isFinal,
        formValue.examType === 'written' ? formValue.writtenExamDetails.duration : formValue.oralExamDetails.studentDuration,
        formValue.examType === 'written' ? formValue.writtenExamDetails.instructions : formValue.oralExamDetails.instructions,
        null,
        null,
        null,
        questions
      );

      this.examsService
        .createExam(exam)
        .then((data) => {
          console.log('Exam created:', data);
          this.dialogRef.close(data);
          this._snackBar.open('تم حفظ الاختبار بنجاح', 'إغلاق', {
            duration: 3000,
          });
        })
        .catch((error) => {
          console.error('Error creating exam:', error);
          this._snackBar.open('حدث خطأ أثناء حفظ الاختبار', 'إغلاق', {
            duration: 3000,
          });
        });
    }
  }
}
