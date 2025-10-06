import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentCircleComponent } from './student-circle.component';

describe('StudentCircleComponent', () => {
  let component: StudentCircleComponent;
  let fixture: ComponentFixture<StudentCircleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentCircleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentCircleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
