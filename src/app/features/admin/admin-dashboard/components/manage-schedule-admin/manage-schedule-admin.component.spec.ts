import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageScheduleAdminComponent } from './manage-schedule-admin.component';

describe('ManageScheduleAdminComponent', () => {
  let component: ManageScheduleAdminComponent;
  let fixture: ComponentFixture<ManageScheduleAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageScheduleAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageScheduleAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
