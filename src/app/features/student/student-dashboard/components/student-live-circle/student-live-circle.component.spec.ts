import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentLiveCircleComponent } from './student-live-circle.component';

describe('StudentLiveCircleComponent', () => {
  let component: StudentLiveCircleComponent;
  let fixture: ComponentFixture<StudentLiveCircleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentLiveCircleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentLiveCircleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
