import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentNotebookComponent } from './student-notebook.component';

describe('StudentNotebookComponent', () => {
  let component: StudentNotebookComponent;
  let fixture: ComponentFixture<StudentNotebookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentNotebookComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentNotebookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
