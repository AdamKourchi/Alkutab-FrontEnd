import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherLiveCircleComponent } from './teacher-live-circle.component';

describe('TeacherLiveCircleComponent', () => {
  let component: TeacherLiveCircleComponent;
  let fixture: ComponentFixture<TeacherLiveCircleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherLiveCircleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherLiveCircleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
