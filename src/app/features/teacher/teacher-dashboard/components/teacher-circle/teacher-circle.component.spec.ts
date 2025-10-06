import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherCircleComponent } from './teacher-circle.component';

describe('TeacherCircleComponent', () => {
  let component: TeacherCircleComponent;
  let fixture: ComponentFixture<TeacherCircleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherCircleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherCircleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
