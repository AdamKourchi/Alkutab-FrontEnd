import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseSchedulerComponent } from './course-scheduler.component';

describe('CourseSchedulerComponent', () => {
  let component: CourseSchedulerComponent;
  let fixture: ComponentFixture<CourseSchedulerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseSchedulerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseSchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
