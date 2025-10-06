import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleSessionDialogComponent } from './schedule-session-dialog.component';

describe('ScheduleSessionDialogComponent', () => {
  let component: ScheduleSessionDialogComponent;
  let fixture: ComponentFixture<ScheduleSessionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleSessionDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleSessionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
