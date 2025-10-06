import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniTeacherRecordsComponent } from './mini-teacher-records.component';

describe('MiniTeacherRecordsComponent', () => {
  let component: MiniTeacherRecordsComponent;
  let fixture: ComponentFixture<MiniTeacherRecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiniTeacherRecordsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiniTeacherRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
